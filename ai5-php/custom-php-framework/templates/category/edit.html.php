<?php
$title = 'Edit Category';
$bodyClass = 'category-edit';
ob_start(); ?>

    <h1>Edit Category</h1>

    <form method="post" action="<?= $router->generatePath('category-edit', ['id' => $category->getId()]) ?>">
        <label>Name:
            <input type="text" name="category[name]" value="<?= $category->getName() ?>" />
        </label>
        <button type="submit">Save</button>
    </form>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
