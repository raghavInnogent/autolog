package com.example.backend.serviceImpl;

import java.awt.image.BufferedImage;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.OcrResponse;
import com.example.backend.service.OcrService;

import net.sourceforge.tess4j.Tesseract;

@Service
public class OcrServiceImpl implements OcrService {

    @Override
    public OcrResponse extractData(MultipartFile file) throws Exception {

        String original = file.getOriginalFilename().toLowerCase();

        if (original.endsWith(".txt")) {
            return extractFromText(file);
        } 
        else if (original.endsWith(".pdf")) {
            return extractFromPdf(file);
        } 
        else if (original.endsWith(".png") || original.endsWith(".jpg") || original.endsWith(".jpeg")) {
            return extractFromImage(file);
        } 
        else {
            throw new Exception("Unsupported format! Use PDF, TXT, PNG, JPG, JPEG.");
        }
    }


    private OcrResponse extractFromText(MultipartFile file) throws Exception {
        String text = new String(file.getBytes());
        return new OcrResponse(text);
    }


    private OcrResponse extractFromImage(MultipartFile file) throws Exception {
        Tesseract t = new Tesseract();
        t.setDatapath("C:/Program Files/Tesseract-OCR/tessdata");
        t.setLanguage("eng");

        BufferedImage img = ImageIO.read(file.getInputStream());
        String result = t.doOCR(img);

        return new OcrResponse(result);
    }


    private OcrResponse extractFromPdf(MultipartFile file) throws Exception {
        PDDocument document = PDDocument.load(file.getBytes());
        PDFRenderer renderer = new PDFRenderer(document);

        Tesseract t = new Tesseract();
        t.setDatapath("C:/Program Files/Tesseract-OCR/tessdata");
        t.setLanguage("eng");

        StringBuilder fullText = new StringBuilder();

        for (int i = 0; i < document.getNumberOfPages(); i++) {
            BufferedImage pageImage = renderer.renderImageWithDPI(i, 300);
            fullText.append(t.doOCR(pageImage)).append("\n\n");
        }

        document.close();
        return new OcrResponse(fullText.toString());
    }
}
