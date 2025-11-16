<?php
$title = 'Create Category';
$bodyClass = 'category-create';
ob_start(); ?>

    <h1>Create Category</h1>

    <form method="post" action="<?= $router->generatePath('category-create') ?>">
        <label>Name:
            <input type="text" name="category[name]" />
        </label>
        <button type="submit">Save</button>
    </form>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
