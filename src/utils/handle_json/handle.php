<?php

//if ($argc < 3) {
//    fwrite(STDERR, "Usage: php process-dropper.php <input.json> <output.json>\n");
//    exit(1);
//}

$inputPath = 'scene.txt';
$outputPath = '../../config/four/scene.json';

if (!is_file($inputPath) || !is_readable($inputPath)) {
    fwrite(STDERR, "Cannot read input file: {$inputPath}\n");
    exit(1);
}

$raw = file_get_contents($inputPath);
if ($raw === false) {
    fwrite(STDERR, "Failed to read input\n");
    exit(1);
}

$data = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);

if (!is_array($data)) {
    fwrite(STDERR, "JSON root must be an array\n");
    exit(1);
}

function stripBlenderSuffix(string $name): string {
    return preg_replace('/\.\d{3,}$/', '', $name) ?? $name;
}

function detectModelType(string $name): string|null {
    $clean = stripBlenderSuffix($name);

    if (preg_match('/^(building_\d+|env_\d+)/i', $clean, $m)) {
        return $m[1];
    }

    //    if (preg_match('/^(building_\d+)/i', $clean, $m)) {
    //        return $m[1];
    //    }

    return null;
}

$grouped = [];

foreach ($data['entities'] as $item) {
    if (!is_array($item)) {
        continue;
    }

    $name = $item['name'] ?? null;
    if (!is_string($name) || $name === '') {
        continue;
    }

    $type = detectModelType($name);

    if (!$type) {
        continue;
    }

    // Нормализуем трансформации: всегда массивы из 3 чисел

    $position = [
        $item['position']['x'],
        $item['position']['z'],
        -$item['position']['y'],
    ];

    $rotation = [
        $item['rotation']['x'],
        $item['rotation']['z'],
        -$item['rotation']['y'],
    ];

    $scale = [
        $item['scale']['x'],
        $item['scale']['z'],
        $item['scale']['y'],
    ];

    //    fwrite(STDOUT, json_encode($position));

    $grouped[$type][] = compact([
                                    'position',
                                    'rotation',
                                    'scale'
                                ]);
}

/**
 * Гарантирует, что значение — массив из трёх чисел.
 *
 * @return array{0: float, 1: float, 2: float}
 */
function normalizeVec3(mixed $value): array {
    if (!is_array($value)) {
        return [0.0, 0.0, 0.0];
    }

    return [
        (float)($value[0] ?? 0),
        (float)($value[1] ?? 0),
        (float)($value[2] ?? 0),
    ];
}

// Сортируем ключи для предсказуемости
ksort($grouped);

$json = json_encode(
    $grouped,
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($json === false) {
    fwrite(STDERR, "Failed to encode JSON\n");
    exit(1);
}

if (file_put_contents($outputPath, $json) === false) {
    fwrite(STDERR, "Failed to write output: {$outputPath}\n");
    exit(1);
}

$total = array_sum(array_map('count', $grouped));
//fwrite(STDOUT, "OK: {$total} instances in " . count($grouped) . " groups\n");
//fwrite(STDOUT, "Types: " . implode(', ', array_keys($grouped)) . "\n");
