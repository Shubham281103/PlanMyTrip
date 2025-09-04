import os
import requests
import logging
from datetime import date
from typing import List, Optional

from langchain.tools import tool
from langchain.agents import initialize_agent, AgentType
from langchain_google_genai import ChatGoogleGenerativeAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIAgent:
    def __init__(self):
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if not google_api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=google_api_key)
        
        tools = [
            AIAgent._search_places_tool,
            AIAgent._get_weather_tool,
            AIAgent._suggest_itinerary_tool
        ]
        
        self.agent = initialize_agent(
            tools,
            self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def _safe_get_json(self, resp):
        try:
            return resp.json()
        except requests.exceptions.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON: {e}")
            logger.error(f"Status code: {resp.status_code}")
            logger.error(f"Response text: {resp.text[:500]}")
            return None

    @staticmethod
    def _get_city_coords(city: str):
        url = f"https://nominatim.openstreetmap.org/search?city={city}&format=json&limit=1"
        headers = {"User-Agent": "TripPlanner/1.0 (dev@example.com)"}
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            try:
                geo = resp.json()
            except requests.exceptions.JSONDecodeError:
                geo = None

            if not geo:
                logger.warning(f"No geocoding result for city: {city}")
                return None, None
            return geo[0]['lat'], geo[0]['lon']
        except requests.exceptions.RequestException as e:
            logger.error(f"Error in _get_city_coords: {e}")
            return None, None

    @staticmethod
    def _search_places(city: str):
        lat, lon = AIAgent._get_city_coords(city)
        if not lat or not lon:
            return []
        url = f"https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=5000&gscoord={lat}|{lon}&gslimit=5&format=json"
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            try:
                data = resp.json()
            except requests.exceptions.JSONDecodeError:
                data = None
            return [place['title'] for place in data.get('query', {}).get('geosearch', [])] if data else []
        except requests.exceptions.RequestException as e:
            logger.error(f"Error in _search_places: {e}")
            return []

    @staticmethod
    def _get_weather(city: str):
        lat, lon = AIAgent._get_city_coords(city)
        if not lat or not lon:
            return {}
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            try:
                data = resp.json()
            except requests.exceptions.JSONDecodeError:
                data = None
            return data.get('current_weather', {}) if data else {}
        except requests.exceptions.RequestException as e:
            logger.error(f"Error in _get_weather: {e}")
            return {}

    @staticmethod
    def _suggest_itinerary(city: str, days: int):
        places = AIAgent._search_places(city)
        if not places:
            return ["No places found."]
        itinerary = []
        for i in range(days):
            place = places[i % len(places)]
            itinerary.append(f"Day {i+1}: Visit {place}")
        return itinerary

    @tool
    @staticmethod
    def _search_places_tool(city: str) -> list:
        """Return a list of the most notable tourist attractions and places to visit in the given city."""
        return AIAgent._search_places(city)

    @tool
    @staticmethod
    def _get_weather_tool(city: str) -> dict:
        """Get the current weather for a given city."""
        return AIAgent._get_weather(city)

    @tool
    @staticmethod
    def _suggest_itinerary_tool(user_input: str) -> list:
        """
        Suggest a travel itinerary for a given city and number of days.
        Input should be 'city, days'.
        """
        parts = [p.strip() for p in user_input.split(",")]
        if len(parts) < 2:
            return ["Error: Please provide input as 'city, days'."]
        city = parts[0]
        try:
            days = int(parts[1])
        except ValueError:
            return ["Error: Number of days must be an integer."]
        return AIAgent._suggest_itinerary(city, days)

    def generate_itinerary(
        self, 
        place: str, 
        start_date: date, 
        end_date: date,
        trip_theme: Optional[List[str]] = None,
        budget: Optional[str] = None,
        pace: Optional[str] = None,
        travel_mode: Optional[str] = None,
        group_type: Optional[str] = None
    ) -> str:
        preferences_context = ""
        if trip_theme:
            preferences_context += f"\nTrip Themes: {', '.join(trip_theme)}"
        if budget:
            preferences_context += f"\nBudget Level: {budget}"
        if pace:
            preferences_context += f"\nPace Preference: {pace}"
        if travel_mode:
            preferences_context += f"\nPreferred Travel Mode: {travel_mode}"
        if group_type:
            preferences_context += f"\nGroup Type: {group_type}"

        theme_recommendations = ""
        if trip_theme:
            theme_recommendations = "\n\nTheme-Based Recommendations:\n"
            for theme in trip_theme:
                if theme.lower() == "adventure":
                    theme_recommendations += "- Focus on outdoor activities, trekking, adventure sports, and adrenaline-pumping experiences\n"
                elif theme.lower() == "religious":
                    theme_recommendations += "- Include temples, holy sites, spiritual experiences, and religious festivals\n"
                elif theme.lower() == "cultural":
                    theme_recommendations += "- Emphasize museums, historical sites, local traditions, and cultural experiences\n"
                elif theme.lower() == "foodie":
                    theme_recommendations += "- Highlight local cuisine, food tours, cooking classes, and famous restaurants\n"
                elif theme.lower() == "relaxation":
                    theme_recommendations += "- Focus on spas, beaches, peaceful locations, and stress-free activities\n"
                elif theme.lower() == "romantic":
                    theme_recommendations += "- Include romantic spots, couple activities, scenic views, and intimate dining\n"
                elif theme.lower() == "family-friendly":
                    theme_recommendations += "- Ensure child-safe activities, family restaurants, and kid-friendly attractions\n"

        group_recommendations = ""
        if group_type:
            group_recommendations = "\n\nGroup-Specific Recommendations:\n"
            if group_type.lower() == "solo":
                group_recommendations += "- Include solo-friendly activities, social opportunities, and safe travel options\n"
            elif group_type.lower() == "couple":
                group_recommendations += "- Focus on romantic activities, intimate dining, and couple-friendly experiences\n"
            elif group_type.lower() == "family":
                group_recommendations += "- Ensure child-safe activities, family restaurants, and kid-friendly attractions\n"
            elif group_type.lower() == "friends":
                group_recommendations += "- Include group activities, social experiences, nightlife, and fun group adventures\n"
            elif group_type.lower() == "senior_friendly":
                group_recommendations += "- Focus on accessible activities, comfortable transportation, and senior-friendly accommodations\n"

        prompt = f"""Generate a detailed travel itinerary for a trip to {place} from {start_date} to {end_date}.{preferences_context}

        Please include:
        - Daily breakdown: A day-by-day plan with specific activities, attractions, and recommended timings.
        - Weather considerations: Suggest activities and packing advice based on the typical weather conditions in {place} during that time.
        - Transportation: Recommendations for getting around based on the preferred travel mode.
        - Accommodation suggestions: Briefly mention suitable accommodation types based on budget level.
        - Food recommendations: Highlight local dishes or restaurants.
        - Optional activities: Include a few extra suggestions.
        - Practical tips: Any essential travel tips (currency, language, safety).{theme_recommendations}{group_recommendations}
        
        Please present the itinerary in a clear, organized, and professional format that aligns with the specified preferences."""
        
        response = self.agent.run(prompt)
        return response

agent_instance = AIAgent()