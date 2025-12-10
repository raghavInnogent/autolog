package com.example.backend.controller;

import java.util.List;

import com.example.backend.dto.ocr.ServiceRecordOCR_DTO;
import com.example.backend.dto.response.OcrResponse;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.OcrService;
import com.example.backend.serviceImpl.GroqService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.service.ServiceRecordService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/servicing")
@RequiredArgsConstructor
public class ServiceRecordController {
	@Autowired
    private ServiceRecordService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OcrService  ocrService;

    @Autowired
    private GroqService groqService;


    @PostMapping("/create")
    public ResponseEntity<ServiceRecordResponseDTO> create(@RequestBody ServiceRecordRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PostMapping("/createServiceViaInvoice")
    public ResponseEntity<ServiceRecordResponseDTO> createServiceViaInvoice(@RequestBody ServiceRecordOCR_DTO dto) {

        ServiceRecordRequestDTO serviceRecordRequestDTO = service.convertToRequestDTO(dto);
        System.out.println(serviceRecordRequestDTO);
        return ResponseEntity.ok(service.create(serviceRecordRequestDTO));
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ServiceRecordResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/getByVehicleId/{id}")
    public ResponseEntity<List<ServiceRecordResponseDTO>> getByVehicleId(@PathVariable Long id) {
        return ResponseEntity.ok(service.getByVehicleId(id));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ServiceRecordResponseDTO>> getAll() {
        Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        return ResponseEntity.ok(service.getAllByUserId(userId));
    }

    @PostMapping("/fetchDataFromImage")
    public ResponseEntity<ServiceRecordOCR_DTO> fetchDataFromImage(@RequestParam MultipartFile image) {

        try {
            String ocrResult = ocrService.extractData(image);
            System.out.println(ocrResult);
            String prompt = createPrompt(ocrResult);
            String groqResult = groqService.askGroq(prompt).block();

            ServiceRecordOCR_DTO serviceRecordOCR_DTO = objectMapper.readValue(groqResult, ServiceRecordOCR_DTO.class);





            return new ResponseEntity<>(serviceRecordOCR_DTO, org.springframework.http.HttpStatus.OK);

        }
        catch(Exception e){
            System.out.println(e);
        }


        return null;
    }

    private String createPrompt(String ocrText) {
        return String.format("""
                You are an expert vehicle service invoice data extraction system. Analyze the OCR text and extract ALL relevant information into the JSON structure exactly as defined below.

                STRICT INSTRUCTIONS:
                1. Return ONLY the JSON object (no explanations, no markdown, no code blocks)
                2. Use EXACTLY the field names provided in the schema
                3. If a field is missing, set it to null
                4. Detect fields even if they appear with different names (e.g., "Date", "Service Date", "Date of Repair", "Invoice Date" → all map to dateOfService)
                5. Normalize date to YYYY-MM-DD format
                6. Extract mileage as an integer (remove commas, "km", "kms", "KM", spaces, etc.)
                7. Extract cost as integer (total billed amount, remove currency symbols, commas, decimals)
                8. Extract perItemCost as integer (remove currency symbols, commas, decimals)
                9. For "type", classify based on invoice contents:
                   - GENERAL_SERVICE → routine service, oil change, filter change, periodic maintenance
                   - REPAIR → fixes, replacements, broken part repairs
                   - INSPECTION → inspection / diagnostic only
                   - OTHER → cannot determine

                CRITICAL - EXPIRY CALCULATION:
                For EVERY item in servicedItems, you MUST calculate expiryInMonth based on standard automotive maintenance intervals:
                - Think about how often each specific automotive part or consumable needs replacement
                - Consider industry-standard maintenance schedules
                - Base this on the specific vehicle type and part characteristics
                - Examples: Engine oil typically needs changing every 6 months, air filters every 12 months, brake pads every 18-24 months, batteries every 36 months
                - For labor/washing/diagnostic services (not physical parts), set expiryInMonth to null
                - NEVER leave expiryInMonth null for actual parts/consumables - always provide a reasonable replacement interval

                JSON SCHEMA:
                {
                  "vehicleModel": "string or null",
                  "vehicleCompany": "string or null",
                  "vehicleNo": "string or null (XX 00 XX 0000)",
                  "cost": "integer or null",
                  "dateOfService": "string (YYYY-MM-DD) or null",
                  "workshop": "string or null",
                  "mileage": "integer or null",
                  "invoice": "string or null",
                  "type": "string or null (GENERAL_SERVICE/REPAIR/INSPECTION/OTHER)",
                  "servicedItems": [
                    {
                      "itemName": "string (REQUIRED)",
                      "quantity": "integer (default 1)",
                      "expiryInMonth": "integer (REQUIRED for parts/consumables, null only for services/labor)",
                      "perItemCost": "integer or null"
                    }
                  ]
                }

                FIELD DETECTION RULES:
                - vehicleCompany → extract vehicle manufacturer/brand name ONLY (e.g., "Tata", "Maruti Suzuki", "Honda", "Hyundai", "Toyota", "Mahindra", "Kia", "MG", "Renault", "Nissan", "Ford", "Volkswagen", "Skoda", "BMW", "Mercedes", "Audi")
                - vehicleModel → extract vehicle model name and variant ONLY (e.g., "Nexon", "Swift VXi", "City ZX", "Creta SX", "Fortuner", "XUV700")
                - VEHICLE PARSING: If you see "Tata Nexon" → vehicleCompany: "Tata", vehicleModel: "Nexon". If you see "Maruti Swift VXi" → vehicleCompany: "Maruti Suzuki", vehicleModel: "Swift VXi"
                - vehicleNo → extract vehicle registration/license plate number (e.g., MH12AB1234, DL01CA2345, KA05MN6789)
                - cost → extract total / grand total / amount payable / net amount / final amount / total amount
                - dateOfService → extract any date related to service, repair, or invoice (convert to YYYY-MM-DD)
                - workshop → extract garage name, service center name, dealer name, authorized service center name, or company name from header/top of invoice
                - mileage → extract odometer reading, km reading, mileage, kilometers (as integer only)
                - invoice → extract invoice number / bill no / receipt no / reference number / invoice#
                - type → classify based on services performed (use classification rules above)
                - servicedItems → parse ALL itemized services/parts line by line, including description, parts replaced, labor charges

                EXPIRY DETERMINATION LOGIC:
                When you encounter an item, ask yourself:
                1. Is this a physical part or consumable? → Calculate replacement interval in months
                2. Is this a service/labor/washing? → Set to null
                3. For parts: What is the standard maintenance interval for this specific component in typical driving conditions?
                4. Consider the item's wear characteristics and manufacturer recommendations

                ADDITIONAL PARSING RULES:
                - Handle multiple date formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD MMM YYYY, etc.
                - Vehicle numbers may have spaces or hyphens - extract as is
                - Workshop name is typically in header/footer or printed at top
                - Some invoices show HSN/SAC codes, tax details - ignore these, focus on item descriptions
                - If quantity is not mentioned for an item, assume 1
                - Match vehicle registration variations: "Reg No", "Registration Number", "Vehicle No", "Car No", "Veh No"
                - Separate vehicle company from model intelligently based on common manufacturer names

                OCR TEXT:
                %s

                MANDATORY: Before returning the JSON, verify that EVERY physical part/consumable in servicedItems has a non-null expiryInMonth value based on your automotive knowledge. Return ONLY the JSON object.
""", ocrText);
    }


}