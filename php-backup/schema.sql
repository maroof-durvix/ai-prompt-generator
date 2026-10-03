-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `ai_prompt_generator` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ai_prompt_generator`;

-- Drop tables if they exist to allow clean reset
DROP TABLE IF EXISTS `prompt_history`;
DROP TABLE IF EXISTS `categories`;

-- Create categories table
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` VARCHAR(255) NOT NULL,
    `template` TEXT NOT NULL,
    `placeholder` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create prompt history table
CREATE TABLE `prompt_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `user_input` TEXT NOT NULL,
    `generated_prompt` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert initial categories matching the UI requirements
INSERT INTO `categories` (`name`, `slug`, `description`, `template`, `placeholder`) VALUES
('Image Generation', 'image-generation', 'Create high-quality images with detailed prompts.', 
 'Generate a high-quality visual representation showing [INPUT]. The style should be modern, clean, with premium aesthetics, rich composition, dynamic lighting, and cinematic atmosphere.', 
 'Example: A futuristic floating city with neon lights and flying cars, digital art style...'),

('Graphic Design', 'graphic-design', 'Generate prompts for logos, banners, posters, and more.', 
 'Create a professional graphic design concept for [INPUT]. The design must incorporate contemporary typography, balanced layout, custom visual assets, and a cohesive, premium color palette suitable for modern brands.', 
 'Example: A minimalist logo design for a sustainable eco-friendly clothing brand...'),

('Website Prompt', 'website-prompt', 'Create prompts for websites, landing pages, and web apps.', 
 'Design a premium landing page/website structure for [INPUT]. The layout must include a captivating hero section with a compelling headline, a call-to-action button, a features grid, user testimonials, pricing sections, and a clean footer. Use modern, highly-polished aesthetics and solid responsive layout guidelines.', 
 'Example: Create a premium landing page for a fitness app with dark theme and modern UI...'),

('UI/UX Prompt', 'ui-ux-prompt', 'Generate prompts for UI/UX designs and user interfaces.', 
 'Create a comprehensive UI/UX user interface design concept for [INPUT]. Focus on optimal user flows, micro-interactions, high accessibility, visual hierarchy, clean card components, consistent spacing, and an overall elegant user experience.', 
 'Example: An intuitive mobile app dashboard for tracking daily financial transactions...'),

('Marketing Prompt', 'marketing-prompt', 'Create prompts for ads, campaigns, and marketing strategies.', 
 'Write a high-converting marketing copy and campaign strategy for [INPUT]. Craft attention-grabbing headlines, persuasive body content, a strong value proposition, and an irresistible call-to-action tailored for target social platforms.', 
 'Example: An Instagram ad campaign copy promoting a new organic coffee blend...'),

('Content Writing Prompt', 'content-writing-prompt', 'Create prompts for blog posts, articles, and content creation.', 
 'Draft an engaging, structured article outline or full post about [INPUT]. Integrate a compelling hook, organized subheadings (H2, H3), well-explained key arguments, a clear writing voice, and a strong summary conclusion.', 
 'Example: A comprehensive guide on the benefits of remote working for tech professionals...');
