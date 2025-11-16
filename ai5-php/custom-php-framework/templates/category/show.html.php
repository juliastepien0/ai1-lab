<?php
$title = 'Category Details';
$bodyClass = 'category-show';
ob_start(); ?>

    <h1>Category</h1>
    <p><strong>ID:</strong> <?= $category->getId() ?></p>
    <p><strong>Name:</strong> <?= $category->getName() ?></p>

    <a href="<?= $router->generatePath('category-index') ?>">Back</a>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
