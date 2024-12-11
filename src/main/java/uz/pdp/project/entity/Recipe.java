package uz.pdp.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String imagePath;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String ingredients;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String steps;

    @Column(nullable = false)
    private boolean enabled = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Новые поля для улучшенной карточки рецепта
    @Column
    private Integer difficulty; // Сложность от 1 до 3

    @Column
    private Integer calories; // Количество калорий

    @Column
    private Double proteins; // Количество белков

    @Column
    private Double carbs; // Количество углеводов

    @Column
    private Integer likes = 0; // Количество лайков

    @Column
    private Integer comments = 0; // Количество комментариев

    @Column
    private Integer views = 0; // Количество просмотров
}
