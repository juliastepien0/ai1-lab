<?php

namespace App\Model;
use App\Service\Config;
class Category
{
    private ?int $id = null;
    private ?string $name = null;

    public function getId(): ?int { return $this->id; }
    public function setId(?int $id): Category { $this->id = $id; return $this; }

    public function getName(): ?string { return $this->name; }
    public function setName(?string $name): Category { $this->name = $name; return $this; }

    public static function fromArray($array): Category
    {
        $category = new self();
        $category->fill($array);
        return $category;
    }

    public function fill($array): Category
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->query("SELECT * FROM category");

        return array_map(fn($row) => self::fromArray($row), $stmt->fetchAll(\PDO::FETCH_ASSOC));
    }

    public static function find($id): ?Category
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->prepare("SELECT * FROM category WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $found = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $found ? self::fromArray($found) : null;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

        if (!$this->getId()) {
            $stmt = $pdo->prepare("INSERT INTO category (name) VALUES (:name)");
            $stmt->execute(['name' => $this->getName()]);
            $this->setId($pdo->lastInsertId());
        } else {
            $stmt = $pdo->prepare("UPDATE category SET name = :name WHERE id = :id");
            $stmt->execute([
                'name' => $this->getName(),
                'id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->prepare("DELETE FROM category WHERE id = :id");
        $stmt->execute(['id' => $this->getId()]);

        $this->id = null;
        $this->name = null;
    }
}