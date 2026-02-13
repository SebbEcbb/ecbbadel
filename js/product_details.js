 let currentIdx = 1;
        let totalImages = 0;
        let productId = "";

        async function initPage() {
            try {
                const response = await fetch('product.json');
                const data = await response.json();
                
                productId = data.id;
                totalImages = data.n;

                // Set Text Content
                document.getElementById('product-name').textContent = data.name;
                document.getElementById('product-price').textContent = `Prix estimé pour marché courant : ${data.price} €`;
                document.title = data.name;

                // Set Description (Iframe)
                const descContainer = document.getElementById('description-content');
                // Ensure the iframe fits nicely
                descContainer.innerHTML = `<div class="iframe-container">${data.description}</div>`;

                // Set Gallery
                const gallery = document.getElementById('gallery');
                for (let i = 1; i <= data.n; i++) {
                    const imgDiv = document.createElement('div');
                    imgDiv.className = "aspect-square bg-stone-200 overflow-hidden cursor-pointer group";
                    imgDiv.innerHTML = `
                        <img src="${i}.jpg" 
                             alt="Photo ${i}" 
                             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                             onclick="openLightbox(${i})"
                             onerror="this.src='https://via.placeholder.com/400?text=Image+${i}'">
                    `;
                    gallery.appendChild(imgDiv);
                }

                // Set Navigation Links
                document.getElementById('contact-btn').href = `/contact.html?ref=${data.id}&url=${encodeURIComponent(window.location.href)}`;
                
                // Logic for "Back to Catalogue"
                // Assuming catalogue structure: /catalogue/category/index.html
                document.getElementById('back-link').href = `../index.html`;

                // Logic for "Next Product" 
                // In a static file context, this is usually an increment of the ID
                // Here we assume a simple naming convention or a relative path
                document.getElementById('next-product').href = `../${data.id.replace(/\d+$/, n => {
                const nextNumber = parseInt(n) + 1;
                return nextNumber.toString().padStart(2, '0');
                })}/index.html`;

            } catch (error) {
                console.error("Erreur de chargement du JSON:", error);
                document.getElementById('product-name').textContent = "Erreur de chargement";
            }
        }

        // Lightbox Functions
        function openLightbox(idx) {
            currentIdx = idx;
            updateLightbox();
            document.getElementById('lightbox').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function updateLightbox() {
            const img = document.getElementById('lightbox-img');
            img.src = `${currentIdx}.jpg`;
        }

        function nextImg() {
            currentIdx = currentIdx >= totalImages ? 1 : currentIdx + 1;
            updateLightbox();
        }

        function prevImg() {
            currentIdx = currentIdx <= 1 ? totalImages : currentIdx - 1;
            updateLightbox();
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('lightbox').classList.contains('active')) return;
            if (e.key === "ArrowRight") nextImg();
            if (e.key === "ArrowLeft") prevImg();
            if (e.key === "Escape") closeLightbox();
        });

        window.onload = initPage;