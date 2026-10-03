<?php
require_once 'config.php';

// Default categories in case DB is not populated or offline
$categories = [
    [
        'id' => 1,
        'name' => 'Image Generation',
        'description' => 'Create high-quality images with detailed prompts.',
        'placeholder' => 'Example: A futuristic floating city with neon lights and flying cars, digital art style...'
    ],
    [
        'id' => 2,
        'name' => 'Graphic Design',
        'description' => 'Generate prompts for logos, banners, posters, and more.',
        'placeholder' => 'Example: A minimalist logo design for a sustainable eco-friendly clothing brand...'
    ],
    [
        'id' => 3,
        'name' => 'Website Prompt',
        'description' => 'Create prompts for websites, landing pages, and web apps.',
        'placeholder' => 'Example: Create a premium landing page for a fitness app with dark theme and modern UI...'
    ],
    [
        'id' => 4,
        'name' => 'UI/UX Prompt',
        'description' => 'Generate prompts for UI/UX designs and user interfaces.',
        'placeholder' => 'Example: An intuitive mobile app dashboard for tracking daily financial transactions...'
    ],
    [
        'id' => 5,
        'name' => 'Marketing Prompt',
        'description' => 'Create prompts for ads, campaigns, and marketing strategies.',
        'placeholder' => 'Example: An Instagram ad campaign copy promoting a new organic coffee blend...'
    ],
    [
        'id' => 6,
        'name' => 'Content Writing Prompt',
        'description' => 'Create prompts for blog posts, articles, and content creation.',
        'placeholder' => 'Example: A comprehensive guide on the benefits of remote working for tech professionals...'
    ]
];

// Try fetching from Database if connected
if ($pdo) {
    try {
        $stmt = $pdo->query('SELECT id, name, description, placeholder FROM categories ORDER BY id ASC');
        $db_categories = $stmt->fetchAll();
        if (!empty($db_categories)) {
            $categories = $db_categories;
        }
    } catch (PDOException $e) {
        // Fall back to default hardcoded categories
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Prompt Generator - Create Professional Prompts in Seconds</title>
    <meta name="description" content="Generate professional prompts for image generation, graphic design, websites, UI/UX, marketing, and content writing. Make your AI experience seamless.">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="header">
        <div class="header-container">
            <a href="#" class="logo">AI <span class="logo-accent">Prompt Generator</span></a>
            <nav class="nav-links">
                <a href="#" class="nav-item active">Home</a>
                <a href="#" class="nav-item">How It Works</a>
                <a href="#" class="nav-item">Examples</a>
                <a href="#" class="nav-item">About</a>
            </nav>
        </div>
    </header>

    <!-- Main Container -->
    <main class="main-content">
        <!-- Hero Section -->
        <section class="hero-section">
            <h1 class="hero-title">Generate Better <br><span class="gradient-text">AI Prompts</span> in Seconds</h1>
            <p class="hero-subtitle">Create professional prompts for design, websites, marketing, content creation, and more with our AI-powered prompt generator.</p>
            <button class="btn btn-cta" id="btn-start-generating">Start Generating</button>
        </section>

        <!-- Builder Tool Workspace -->
        <section class="builder-section" id="prompt-builder">
            <!-- Category Section -->
            <div class="section-group">
                <h2 class="section-title">Choose a Prompt Category</h2>
                <div class="category-grid">
                    <?php foreach ($categories as $index => $cat): ?>
                        <div class="category-card <?php echo $index === 0 ? 'active' : ''; ?>" 
                             data-id="<?php echo htmlspecialchars($cat['id']); ?>"
                             data-placeholder="<?php echo htmlspecialchars($cat['placeholder']); ?>">
                            <h3 class="card-title"><?php echo htmlspecialchars($cat['name']); ?></h3>
                            <p class="card-desc"><?php echo htmlspecialchars($cat['description']); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Description / Input Section -->
            <div class="section-group">
                <h2 class="section-title">Describe What You Need</h2>
                <div class="textarea-container">
                    <textarea id="prompt-input" 
                              maxlength="2000" 
                              placeholder="<?php echo htmlspecialchars($categories[0]['placeholder']); ?>"></textarea>
                    <div class="char-counter"><span id="char-count">0</span> / 2000</div>
                </div>
            </div>

            <!-- Generate Button -->
            <div class="action-container">
                <button class="btn btn-generate" id="btn-generate">Generate Prompt</button>
            </div>

            <!-- Generated Output Section -->
            <div class="section-group" id="output-section">
                <h2 class="section-title">Generated Prompt</h2>
                <div class="output-container">
                    <div class="output-box" id="output-box">
                        Your generated prompt will appear here after clicking "Generate Prompt"...
                    </div>
                </div>
            </div>

            <!-- Copy Button -->
            <div class="action-container">
                <button class="btn btn-copy" id="btn-copy" disabled>Copy Prompt</button>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; <?php echo date('Y'); ?> AI Prompt Generator. All rights reserved.</p>
    </footer>

    <!-- Frontend logic -->
    <script src="script.js"></script>
</body>
</html>
