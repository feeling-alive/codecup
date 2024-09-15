document.addEventListener('DOMContentLoaded', () => {
    const humburgerButton = document.getElementById('list');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Function to position and center the dropdown menu
    const updateDropdownPosition = () => {
        const buttonRect = humburgerButton.getBoundingClientRect();

        // Показать меню временно, чтобы получить его ширину
        dropdownMenu.classList.add('show');
        const menuWidth = dropdownMenu.offsetWidth;
        dropdownMenu.classList.remove('show'); // Скрыть обратно, если оно было скрыто

        console.log('Button coordinates:', buttonRect);
        console.log('Dropdown menu width:', menuWidth);

        // Set the top position just below the button
        dropdownMenu.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
        console.log('Updated dropdown top position:', dropdownMenu.style.top);

        // Calculate the left position for centering
        let leftPosition = buttonRect.left + window.scrollX + (buttonRect.width / 2) - (menuWidth / 2);
        console.log('Calculated left position before bounds check:', leftPosition);

        // Ensure the dropdown does not go outside the viewport bounds
        if (leftPosition < 0) {
            leftPosition = 0; // Avoid going out of the screen on the left side
        } else if (leftPosition + menuWidth > window.innerWidth) {
            leftPosition = window.innerWidth - menuWidth; // Avoid going out of the screen on the right side
        }

        dropdownMenu.style.left = `${leftPosition}px`;
        console.log('Updated dropdown left position:', dropdownMenu.style.left);
    };

    // Toggle the visibility of the dropdown menu
    const toggleDropdown = () => {
        console.log('Toggling dropdown visibility');

        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
            humburgerButton.classList.remove('pressed');
            console.log('Dropdown closed');
        } else {
            updateDropdownPosition(); // Update position before showing
            dropdownMenu.classList.add('show');
            humburgerButton.classList.add('pressed');
            console.log('Dropdown opened');
        }
    };

    // Event listener for button click
    humburgerButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event bubbling
        console.log('Humburger button clicked');
        toggleDropdown();
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', (event) => {
        console.log('Document clicked');
        if (!humburgerButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
                humburgerButton.classList.remove('pressed');
                console.log('Dropdown closed due to outside click');
            }
        }
    });

    // Update position when window is resized
    window.addEventListener('resize', () => {
        console.log('Window resized, updating dropdown position');
        if (dropdownMenu.classList.contains('show')) {
            updateDropdownPosition(); // Only update if menu is visible
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            dropdownItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const imgAddingButton = document.getElementById('img_adding');
    const canvas = document.getElementById('LoadImg');
    const canvasArea = document.getElementById('canvasArea');
    const ctx = canvas.getContext('2d');
    const mainText = document.querySelector('.main_text');
    const fileSizeText = document.querySelector('.file_size');
    const saveButton = document.getElementById('SaveButton');

    // Maximum file size in MB
    const MAX_FILE_SIZE_MB = 5;

    // Fixed border size for the canvas container
    const CANVAS_BORDER_WIDTH = 1140;
    const CANVAS_BORDER_HEIGHT = 640;

    // Function to handle image loading
    function handleImage(image) {
        const img = new Image();
        img.onload = function() {
            // Calculate aspect ratios
            const imgAspectRatio = img.width / img.height;
            const borderAspectRatio = CANVAS_BORDER_WIDTH / CANVAS_BORDER_HEIGHT;

            let canvasWidth, canvasHeight;
            let scale;

            if (imgAspectRatio > borderAspectRatio) {
                // Image is wider relative to the border
                canvasWidth = CANVAS_BORDER_WIDTH;
                canvasHeight = canvasWidth / imgAspectRatio;
            } else {
                // Image is taller relative to the border or square
                canvasHeight = CANVAS_BORDER_HEIGHT;
                canvasWidth = canvasHeight * imgAspectRatio;
            }

            // Update canvas size
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Calculate scale to fit the image within the canvas borders
            if (img.width / canvas.width > img.height / canvas.height) {
                scale = canvas.width / img.width;
            } else {
                scale = canvas.height / img.height;
            }

            // Center the image on the canvas
            const drawWidth = img.width * scale;
            const drawHeight = img.height * scale;
            const x = (canvas.width - drawWidth) / 2;
            const y = (canvas.height - drawHeight) / 2;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the image on the canvas
            ctx.drawImage(img, x, y, drawWidth, drawHeight);

            // Adjust canvas area size to fit image
            canvasArea.style.width = `${canvas.width}px`;
            canvasArea.style.height = `${canvas.height}px`;

            // Hide the text and button
            mainText.style.display = 'none';
            fileSizeText.style.display = 'none';
            imgAddingButton.style.display = 'none'; // Hide the add image button
        };
        img.src = URL.createObjectURL(image);
    }

    // Handle file input change
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) { // Check file size
                handleImage(file);
            } else {
                alert('File size exceeds 5MB');
            }
        }
    });

    // Open file input dialog on button click
    imgAddingButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle drag over
    canvasArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        canvasArea.classList.add('dragover');
    });

    // Handle drag leave
    canvasArea.addEventListener('dragleave', () => {
        canvasArea.classList.remove('dragover');
    });

    // Handle drop
    canvasArea.addEventListener('drop', (event) => {
        event.preventDefault();
        canvasArea.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        if (file) {
            if (file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) { // Check file size
                handleImage(file);
            } else {
                alert('File size exceeds 5MB');
            }
        }
    });

    // Handle save button click
    saveButton.addEventListener('click', () => {
        if (canvas.width > 0 && canvas.height > 0) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'image.png';
            link.click();
        } else {
            alert('No image to save');
        }
    });
});
