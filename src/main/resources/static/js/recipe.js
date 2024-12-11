document.addEventListener('DOMContentLoaded', () => {
    const addIngredientButton = document.querySelector('.add-ingredient');
    const ingredientsList = document.querySelector('.ingredients-list');

    addIngredientButton.addEventListener('click', () => {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.innerHTML = `
            <input type="text" placeholder="Ингредиент">
            <input type="text" placeholder="Количество">
            <button type="button" class="remove-ingredient"><i class="fas fa-minus"></i></button>
        `;
        ingredientsList.appendChild(ingredientItem);

        const removeButton = ingredientItem.querySelector('.remove-ingredient');
        removeButton.addEventListener('click', () => {
            ingredientsList.removeChild(ingredientItem);
        });
    });

    const addStepButton = document.querySelector('.add-step');
    const stepsList = document.querySelector('.steps-list');

    addStepButton.addEventListener('click', () => {
        const stepItem = document.createElement('div');
        stepItem.className = 'step-item';
        stepItem.innerHTML = `
            <textarea placeholder="Опишите шаг"></textarea>
            <button type="button" class="remove-step"><i class="fas fa-minus"></i></button>
        `;
        stepsList.appendChild(stepItem);

        const removeButton = stepItem.querySelector('.remove-step');
        removeButton.addEventListener('click', () => {
            stepsList.removeChild(stepItem);
        });
    });

    const imageInput = document.getElementById('recipeImage');
    const imagePreview = document.querySelector('.image-preview');

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.style.backgroundImage = `url(${e.target.result})`;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
});
