package com.example.product.service;

import com.example.product.model.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ProductService {

    private final AtomicLong idGenerator = new AtomicLong(3);

    private final List<Product> products = new ArrayList<>(List.of(
            new Product(1L, "Laptop", "Development laptop", 85000, "Electronics"),
            new Product(2L, "Keyboard", "Mechanical keyboard", 3000, "Accessories"),
            new Product(3L, "Monitor", "27-inch development monitor", 15000, "Electronics")
    ));

    public List<Product> getAllProducts() {
        return products;
    }

    public Product getProductById(Long id) {
        return products.stream()
                .filter(product -> product.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Product addProduct(Product product) {
        product.setId(idGenerator.incrementAndGet());
        products.add(product);
        return product;
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = getProductById(id);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setCategory(updatedProduct.getCategory());

        return existingProduct;
    }

    public boolean deleteProduct(Long id) {
        return products.removeIf(product -> product.getId().equals(id));
    }
}
