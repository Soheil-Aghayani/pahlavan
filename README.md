# 📖 Pahlavan: A Digital Musical Manuscript

**Pahlavan** is an interactive, 3-dimensional digital album that bridges ancient Persian mythology with modern web technology. Inspired by the "Pahlavani" tradition and the epic history of Iran, this project invites users to explore a musical journey through the pages of a virtual ancient manuscript.

## ✨ Key Features

* **3D Interactive Book Engine:** A custom-built engine using advanced CSS 3D transforms (`perspective`, `rotateY`) to simulate a realistic, tactile page-flipping experience.
* **Minimalist Tactical Audio Player:** A bespoke audio interface featuring a centered "Play/Pause" control and a seek bar that fills with an animated golden gradient as the track progresses.
* **Atmospheric Particle System:** A high-performance **Canvas API** implementation that renders floating golden dust and embers, creating a cinematic, mystical environment.
* **Dynamic Content Management:** Fully data-driven architecture; all track metadata, stories, and assets are managed via a central `data.js` file for seamless updates.
* **Immersive Backgrounds:** Designed to support cinematic, high-contrast environments that enhance the 3D depth of the manuscript.

## 🛠 Tech Stack

* **HTML5 & CSS3:** Leverages CSS variables, 3D perspectives, and custom transitions for the UI.
* **Vanilla JavaScript (ES6+):** Handles the core book logic, real-time audio synchronization, and state management without the need for external libraries.
* **Canvas API:** Powers the dynamic particle background.
* **Typography:** Features **Cinzel** and **Charm** via Google Fonts to evoke a classical, hand-inked manuscript aesthetic.

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Soheil-Aghayani/pahlavan.git](https://github.com/Soheil-Aghayani/pahlavan.git)
    ```
2.  **Launch the experience:**
    Simply open `index.html` in any modern web browser (Chrome, Safari, or Firefox recommended).

## 📂 Project Structure

* `index.html`: The core application container and entry point.
* `style.css`: The "engine" of the visuals, containing 3D transformations and the minimalist player design.
* `script.js`: The "brain" of the project, managing page logic, audio sync, and animations.
* `data.js`: The centralized database for the album's tracks, stories, and metadata.
* `assets/`: Storage for high-resolution images (`images/`) and track audio files (`songs/`).

## 👤 About the Developer

**Soheil Aghayani**
* 🎓 **M.Sc. in Environmental Engineering** – University of Tehran
* 💻 **Interests**: Python Programming, Web Development, and Classical Persian Literature
* 📧 **Email**: soheil.aghayani@ut.ac.ir
* 🔗 **LinkedIn**: [linkedin.com/in/AgSeyl](https://linkedin.com/in/AgSeyl)

---