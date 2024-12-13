function navigateToRecipe(element) {
	const recipeId = element.closest('.recipe-card').getAttribute('data-recipe-id');
	if (recipeId && recipeId !== 'null') {
		window.location.href = '/recipe/' + recipeId;
	}
}

function toggleTooltip(button) {
	event.stopPropagation();
	const tooltip = button.nextElementSibling;
	const allTooltips = document.querySelectorAll('.recipe-card-tooltip');
	
	// Close all other tooltips
	allTooltips.forEach(t => {
		if (t !== tooltip) {
			t.style.display = 'none';
		}
	});
	
	tooltip.style.display = tooltip.style.display === 'none' ? 'block' : 'none';
}

// Close tooltips when clicking outside
document.addEventListener('click', function(event) {
	const tooltips = document.querySelectorAll('.recipe-card-tooltip');
	const buttons = document.querySelectorAll('.recipe-card-options-btn');
	
	if (!Array.from(buttons).some(btn => btn.contains(event.target))) {
		tooltips.forEach(tooltip => {
			tooltip.style.display = 'none';
		});
	}
});

function handleTooltipClick(event, link) {
	event.preventDefault();
	event.stopPropagation();
	
	if (link.classList.contains('delete-option')) {
		if (confirm('Вы уверены, что хотите удалить этот рецепт?')) {
			window.location.href = link.getAttribute('href');
		}
	} else {
		window.location.href = link.getAttribute('href');
	}
}

// Initialize recipe card click handlers
document.addEventListener('DOMContentLoaded', function() {
	const recipeCards = document.querySelectorAll('.recipe-card');
	recipeCards.forEach(card => {
		card.addEventListener('click', function() {
			const recipeId = this.getAttribute('data-recipe-id');
			window.location.href = '/recipe/' + recipeId;
		});
	});
});