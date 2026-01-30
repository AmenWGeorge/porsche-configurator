
# Porsche Exclusive - NeoLuxury Customization Suite

![Porsche Configurator Banner](https://via.placeholder.com/1200x400?text=Porsche+Exclusive+Configurator)

A next-generation, 3D web-based car configurator allowing users to customize, visualize, and order Porsche vehicles in real-time. Built with Three.js, PHP, and a Cyber-Neo aesthetic.

## 🚀 Features

* **Real-time 3D Rendering:** High-fidelity vehicle visualization using WebGL and Three.js.
* **Dynamic Customization:** Change paint colors (Gloss/Matte/Metallic), wheel types, and caliper colors instantly.
* **User Authentication:** Secure Login and Registration system to save user preferences.
* **Mock E-Commerce:** Full checkout simulation with order generation and database persistence.
* **Responsive Design:** "Glassmorphism" UI that works on desktop and tablets.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Variables, Animations), JavaScript (ES6+).
* **3D Engine:** Three.js (GLTFLoader, OrbitControls).
* **Backend:** PHP 8.0+.
* **Database:** MySQL / MariaDB.
* **Libraries:** GSAP (Animations), FontAwesome (Icons).

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/porsche-configurator.git](https://github.com/yourusername/porsche-configurator.git)
    ```

2.  **Database Setup**
    * Open phpMyAdmin or your MySQL client.
    * Create a database named `porsche_exclusive`.
    * Import the `database.sql` file located in the root directory.

3.  **Server Config**
    * Ensure you are running a local server (WAMP/XAMPP/MAMP).
    * Move the project folder to your `www` or `htdocs` directory.
    * Edit `php/config.php` if your DB credentials differ from default:
        ```php
        define('DB_USER', 'root');
        define('DB_PASS', '');
        ```

4.  **Run**
    * Navigate to [Live Project] 'https://697d092fc4c1ac3ed2f26911--frolicking-kashata-543bb3.netlify.app/' in your browser.

## 👥 Contributors

* **[Amen Wondimu]:** 
* **[Omer Elias]:** 
* **[Kebron Fikru]:** 

## 📄 License

This project is for educational purposes only. Porsche brand assets are property of Porsche AG.