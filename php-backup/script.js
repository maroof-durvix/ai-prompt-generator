document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.category-card');
    const textInput = document.getElementById('prompt-input');
    const charCount = document.getElementById('char-count');
    const generateBtn = document.getElementById('btn-generate');
    const copyBtn = document.getElementById('btn-copy');
    const outputBox = document.getElementById('output-box');
    const btnStartGenerating = document.getElementById('btn-start-generating');

    let activeCategoryId = cards[0] ? cards[0].dataset.id : 1;

    // Handle Category Card Selection
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            activeCategoryId = card.dataset.id;
            
            // Set dynamic placeholder matching active category
            if (card.dataset.placeholder) {
                textInput.placeholder = card.dataset.placeholder;
            }
        });

        // Add 3D card parallax glow effect based on mouse movements
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // Character Counter
    textInput.addEventListener('input', () => {
        const length = textInput.value.length;
        charCount.textContent = length;
        
        if (length > 1800) {
            charCount.style.color = '#f59e0b'; // Warn orange
        } else if (length >= 2000) {
            charCount.style.color = '#ef4444'; // Red limit
        } else {
            charCount.style.color = '';
        }
    });

    // Scroll to Builder Section
    if (btnStartGenerating) {
        btnStartGenerating.addEventListener('click', () => {
            document.getElementById('prompt-builder').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Call API to Generate Prompt
    generateBtn.addEventListener('click', async () => {
        const userInput = textInput.value.trim();
        
        if (!userInput) {
            alert('Please describe what you need in the description box.');
            textInput.focus();
            return;
        }

        // Visual loading feedback
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        outputBox.classList.remove('has-content');
        outputBox.innerHTML = '<span class="loading-pulse">Analyzing prompt parameters and crafting output...</span>';

        try {
            const response = await fetch('generate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category_id: activeCategoryId,
                    user_input: userInput
                })
            });

            const result = await response.json();
            
            if (result.success) {
                outputBox.textContent = result.generated_prompt;
                outputBox.classList.add('has-content');
                copyBtn.disabled = false;
            } else {
                outputBox.textContent = result.error || 'An unexpected error occurred.';
                copyBtn.disabled = true;
            }
        } catch (error) {
            outputBox.textContent = 'Could not connect to the backend server. Make sure PHP is running locally.';
            copyBtn.disabled = true;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Prompt';
        }
    });

    // Copy to Clipboard Action
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputBox.textContent;
        if (!textToCopy || !outputBox.classList.contains('has-content')) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.borderColor = '#22c55e';
            copyBtn.style.color = '#22c55e';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.borderColor = '';
                copyBtn.style.color = '';
            }, 1500);
        }).catch(err => {
            alert('Failed to copy to clipboard.');
        });
    });
});
