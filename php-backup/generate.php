<?php
header('Content-Type: application/json');
require_once 'config.php';

// Hardcoded fallback data in case database is offline
$fallback_categories = [
    1 => [
        'id' => 1,
        'name' => 'Image Generation',
        'template' => 'Generate a high-quality visual representation showing [INPUT]. The style should be modern, clean, with premium aesthetics, rich composition, dynamic lighting, and cinematic atmosphere.'
    ],
    2 => [
        'id' => 2,
        'name' => 'Graphic Design',
        'template' => 'Create a professional graphic design concept for [INPUT]. The design must incorporate contemporary typography, balanced layout, custom visual assets, and a cohesive, premium color palette suitable for modern brands.'
    ],
    3 => [
        'id' => 3,
        'name' => 'Website Prompt',
        'template' => 'Design a premium landing page/website structure for [INPUT]. The layout must include a captivating hero section with a compelling headline, a call-to-action button, a features grid, user testimonials, pricing sections, and a clean footer. Use modern, highly-polished aesthetics and solid responsive layout guidelines.'
    ],
    4 => [
        'id' => 4,
        'name' => 'UI/UX Prompt',
        'template' => 'Create a comprehensive UI/UX user interface design concept for [INPUT]. Focus on optimal user flows, micro-interactions, high accessibility, visual hierarchy, clean card components, consistent spacing, and an overall elegant user experience.'
    ],
    5 => [
        'id' => 5,
        'name' => 'Marketing Prompt',
        'template' => 'Write a high-converting marketing copy and campaign strategy for [INPUT]. Craft attention-grabbing headlines, persuasive body content, a strong value proposition, and an irresistible call-to-action tailored for target social platforms.'
    ],
    6 => [
        'id' => 6,
        'name' => 'Content Writing Prompt',
        'template' => 'Draft an engaging, structured article outline or full post about [INPUT]. Integrate a compelling hook, organized subheadings (H2, H3), well-explained key arguments, a clear writing voice, and a strong summary conclusion.'
    ]
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

// Decode raw JSON input
$input_data = json_decode(file_get_contents('php://input'), true);

$category_id = isset($input_data['category_id']) ? intval($input_data['category_id']) : 0;
$user_input = isset($input_data['user_input']) ? trim($input_data['user_input']) : '';

if (empty($user_input)) {
    echo json_encode(['error' => 'Please describe what you need.']);
    exit;
}

if (strlen($user_input) > 2000) {
    echo json_encode(['error' => 'Input exceeds maximum length of 2000 characters.']);
    exit;
}

$category = null;
$template = '';

if ($pdo) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$category_id]);
        $category = $stmt->fetch();
        if ($category) {
            $template = $category['template'];
        }
    } catch (PDOException $e) {
        // Fallback to offline mode logic
    }
}

// If DB is offline or category not found in DB, search fallback list
if (!$category && isset($fallback_categories[$category_id])) {
    $category = $fallback_categories[$category_id];
    $template = $category['template'];
}

if (!$category) {
    echo json_encode(['error' => 'Selected category is invalid.']);
    exit;
}

// Perform template replacement
$generated_prompt = str_replace('[INPUT]', $user_input, $template);

// If db is connected, log/save history
if ($pdo) {
    try {
        $stmt = $pdo->prepare('INSERT INTO prompt_history (category_id, user_input, generated_prompt) VALUES (?, ?, ?)');
        $stmt->execute([$category_id, $user_input, $generated_prompt]);
    } catch (PDOException $e) {
        // Suppress history insert error to prevent breaking user flow
    }
}

echo json_encode([
    'success' => true,
    'generated_prompt' => $generated_prompt
]);
