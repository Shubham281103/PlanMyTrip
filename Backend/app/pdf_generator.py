from fpdf import FPDF
import os
from datetime import datetime

PDF_STORAGE_PATH = "/app/generated_pdfs"
FONT_PATH = os.path.join(os.path.dirname(__file__), "fonts", "DejaVuSans.ttf")

class PDFGenerator:
    def generate(self, content: str, user_id: int, destination: str) -> str:
        if not os.path.exists(PDF_STORAGE_PATH):
            os.makedirs(PDF_STORAGE_PATH)
        
        pdf = FPDF()
        pdf.add_page()
        # Register and use the Unicode font
        pdf.add_font("DejaVu", "", FONT_PATH, uni=True)
        pdf.set_font("DejaVu", size=12)
        
        # Add content to the PDF
        pdf.multi_cell(0, 10, content)
        
        # Generate a unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"itinerary_{user_id}_{destination.replace(' ', '_')}_{timestamp}.pdf"
        filepath = os.path.join(PDF_STORAGE_PATH, filename)
        
        # Save the PDF
        pdf.output(filepath)
        
        return filename

pdf_generator_instance = PDFGenerator()