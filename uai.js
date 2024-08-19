// Get the root element
const root = document.documentElement;

// Get the toggle button
const toggle = document.getElementById("toggle");
// Get the user's preference from localStorage
const darkMode = localStorage.getItem("dark-mode");
// Check if the user has already chosen a theme
if (darkMode) {
  // If yes, apply it to the root element
  root.classList.add("dark-theme");
}
// Add an event listener to the toggle button
toggle.addEventListener("click", () => {
  // Toggle the dark-theme class on the root element
  root.classList.toggle("dark-theme");
  // Store or remove the user's preference in localStorage
  if (root.classList.contains("dark-theme")) {
    localStorage.setItem("dark-mode", true);
  } else {
    localStorage.removeItem("dark-mode");
  }
});


document.addEventListener("DOMContentLoaded", function() {

    const cards = ['me', 'con', 'pro', 'de', 'dataviz'];
    const dragInstances = cards.reduce((acc, id) => {
        acc[id] = new NeoDrag.Draggable(document.getElementById(id), {  onDrag: updateLines });
        return acc;
    }, {});

    function getOffset(el) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            width: rect.width,
            height: rect.height
        };
    }

    function drawLine(svg, d, color) {
        svg.append("path")
            .attr("d", d)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "none");
    }

    function getLinePath(startX, startY, endX, endY, condition) {
        let path = `M ${startX},${startY}`;

        // Create different path shapes based on conditions
        switch (condition) {
            case 'direita-coladinho':
                path += ` L 
                    ${startX -10},${startY}
                    ${startX -10},${startY - 30}
                    ${startX +175},${startY - 30}
                    ${startX +175},${endY}
                    ${endX},${endY}`;
                break;
             case 'direita-abaixo':
                path += ` L 
                    ${startX -10},${startY}
                    ${startX -10},${endY}
                    ${endX},${endY}`;
                break;
             case 'direita-acima':
                path += ` L 
                    ${startX -10},${startY}
                    ${startX -10},${endY}
                    ${endX},${endY}`;
                break;
             case 'esquerda-abaixo':
                path += ` L 
                    ${startX -10},${startY}
                    ${endX -10},${startY}
                    ${endX-10},${endY}
                    ${endX},${endY}`;
                break;
            default:
                path += ` L ${endX},${endY}`;
                break;
        }

        return path;
    }

    function updateLines() {
        var svg = d3.select("#lines");
        
        svg.selectAll("*").remove(); 
        
        var offsets = cards.reduce((acc, id) => {
            acc[id] = getOffset(document.getElementById(id));
            return acc;
        }, {});

        // Define the pairs of cards to draw lines between
        const pairs = [
            ['me', 'con'],
            ['me', 'pro'],
            ['me', 'de'],
            ['me', 'dataviz']
        ];

        // Starting point for the first line
        let baseStartY = offsets['me'].top + 15;
        let baseEndY = baseStartY;

        // Iterate over each pair and draw the lines
        pairs.forEach(([startCard, endCard], index) => {
            var startX = offsets[startCard].left;
            var startY = baseStartY + (index * 5); // Increment 5px for each new line
            var startBo = offsets[startCard].bottom;
            var endX = offsets[endCard].left;
            var endY = offsets[endCard].top + 15;

            // Determine the condition and color based on relative position
            var condition = '';
            var color = "gray";

            if (startX <= endX && startBo >= endY && startY <= endY) {
                // direita coladinho
                condition = 'direita-coladinho';
            } else if (startX <= endX && startBo <= endY) {
                condition = 'direita-abaixo';
            } else if (startX <= endX && startY >= endY) {
                condition = 'direita-acima';
            } else if (startX >= endX) {
                condition = 'esquerda-abaixo';
            }

            var path = getLinePath(startX, startY, endX, endY, condition);
            drawLine(svg, path, color);
        });
    }

    document.querySelectorAll('summary').forEach(summary => {
        summary.addEventListener('toggle', updateLines);
    });


    updateLines();

    window.addEventListener('resize', updateLines);
});

