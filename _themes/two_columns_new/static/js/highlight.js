document.addEventListener("DOMContentLoaded", function() {
    const content = document.getElementById('content');
    const viewport = document.getElementById('links-references');

    // Helper function to check if an element is at least partially in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect(); // Adjusted to content's bounding rect
        const windowHeight = content.clientHeight;
        const windowWidth = content.clientWidth;

        // Check if any part of the element is visible
        const vertInView = (rect.top <= contentRect.bottom) && ((rect.top + rect.height) >= contentRect.top);
        const horInView = (rect.left <= contentRect.right) && ((rect.left + rect.width) >= contentRect.left);

        return vertInView && horInView;
    }

    // Highlight elements based on class or tag
    function highlightElements() {
        console.log("Highlighting elements");
        // Remove existing highlights
        content.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
        });

        // Define classes and tags to highlight
        const classesToHighlight = [
            'a.reference.external',
            'span.xref.myst',
            'figure'
        ];

        // Loop through each class/tag and highlight elements
        classesToHighlight.forEach(selector => {
            content.querySelectorAll(selector).forEach(el => {
                if (isInViewport(el)) {
                    el.classList.add('highlight');
                }
            });
        });
    }

    // Move highlighted elements to the right-hand column with spacing
    function moveHighlightedElements() {
        console.log("Moving highlighted elements");
        const highlightedElements = content.querySelectorAll('.highlight');
        viewport.innerHTML = ''; // Clear previous content

        highlightedElements.forEach((el, index) => {
            const clone = el.cloneNode(true);
            if (index > 0) {
                viewport.appendChild(document.createElement('br')); // Add spacing between elements
            }
            viewport.appendChild(clone);
        });
    }

    // Update highlighted elements and move them
    function updateHighlights() {
        console.log("Running updateHighlights");
        highlightElements();
        moveHighlightedElements();
    }

    // Initial highlighting and moving of highlighted elements
    updateHighlights();

    // Listen for scroll events within the content area
    content.addEventListener('scroll', updateHighlights);

    // Listen for resize events to trigger update
    window.addEventListener('resize', updateHighlights);
});
