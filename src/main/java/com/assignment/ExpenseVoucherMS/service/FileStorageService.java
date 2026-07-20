package com.assignment.ExpenseVoucherMS.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;


@Service
public class FileStorageService {

    @Value("${file.signUploadDir}")
    private String uploadDir;

    public String store(MultipartFile file){
        try{
            Path dirPath = Paths.get(uploadDir);
            if (!Files.exists(dirPath)){
                Files.createDirectories(dirPath);
            }
            String orignalName = file.getOriginalFilename();
            String extention = (orignalName != null && orignalName.contains(".")) ? orignalName.substring(orignalName.lastIndexOf(".")) : "";
            String fileName = UUID.randomUUID() + extention;
            Path targetPath = dirPath.resolve(fileName);
            Files.copy(file.getInputStream(),targetPath,StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/signatures/" + fileName;
        }catch (IOException e){
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
}
