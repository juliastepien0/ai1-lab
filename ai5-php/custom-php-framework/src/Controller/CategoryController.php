<?php

namespace App\Controller;
use App\Model\Category;
use App\Service\Router;
use App\Service\Templating;
use App\Exception\NotFoundException;
class CategoryController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $categories = Category::findAll();

        return $templating->render('category/index.html.php', [
            'categories' => $categories,
            'router' => $router,
        ]);
    }

    public function createAction(?array $requestCategory, Templating $templating, Router $router): ?string
    {
        if ($requestCategory) {
            $category = Category::fromArray($requestCategory);
            $category->save();

            $router->redirect($router->generatePath('category-index'));
            return null;
        }

        $category = new Category();

        return $templating->render('category/create.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
    }

    public function editAction(int $id, ?array $requestCategory, Templating $templating, Router $router): ?string
    {
        $category = Category::find($id);
        if ($requestCategory) {
            $category->fill($requestCategory);
            $category->save();

            $router->redirect($router->generatePath('category-index'));
            return null;
        }

        return $templating->render('category/edit.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
    }

    public function showAction(int $id, Templating $templating, Router $router): ?string
    {
        $category = Category::find($id);
        return $templating->render('category/show.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
    }

    public function deleteAction(int $id, Router $router): ?string
    {
        $category = Category::find($id);
        $category->delete();
        $router->redirect($router->generatePath('category-index'));

        return null;
    }
}
//http://localhost:53849/index.php?action=category-index