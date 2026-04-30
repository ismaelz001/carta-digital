# fix-images.ps1 — descarga imágenes correctas de Unsplash (foto gratuita)
# Usando IDs de fotos conocidas y verificadas de Unsplash

$dest = "F:\carta-digital\public\assets\raxoi\dishes"

$images = @(
    # [nombre_archivo, url_unsplash_directa]
    @("jamon.jpg",          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80"),   # jamón ibérico loncheado
    @("croquetas-gallegas.jpg", "https://images.unsplash.com/photo-1593001874117-c22021de4c5a?w=800&q=80"), # croquetas
    @("empanada.jpg",       "https://images.unsplash.com/photo-1594179047519-f347310d3322?w=800&q=80"),   # empanada / pie rellena
    @("cocido-gallego.jpg", "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"),     # cocido/estofado carne
    @("tortilla.jpg",       "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80"),  # tortilla española
    @("pulpo-feira.jpg",    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80"),  # pulpo a feira
    @("mariscada.jpg",      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"),    # marisco/langosta
    @("almejas.jpg",        "https://images.unsplash.com/photo-1606850780696-89f68e38f46b?w=800&q=80"), # almejas/clams
    @("mejillones.jpg",     "https://images.unsplash.com/photo-1569863839774-f8d18b65e38e?w=800&q=80"), # mejillones
    @("navajas.jpg",        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80"), # mariscos similares
    @("calamar-ria.jpg",    "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80"), # calamares fritos
    @("rodaballo.jpg",      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80"), # pescado blanco
    @("arroz-marisco.jpg",  "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80"),   # arroz con marisco/paella
    @("chuleton.jpg",       "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80"),   # chuletón a la brasa
    @("entrecot.jpg",       "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80"),   # entrecot filete
    @("ensalada-cesar.jpg", "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80"),   # ensalada césar
    @("hamburguesa.jpg",    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"), # hamburguesa
    @("pizza.jpg",          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"), # pizza
    @("pizza-margarita.jpg","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"), # pizza margarita
    @("bocadillo.jpg",      "https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=800&q=80"),   # bocadillo/sandwich
    @("croissant.jpg",      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80"),   # croissant
    @("tortitas.jpg",       "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80"), # tortitas pancakes
    @("bowl-yogur.jpg",     "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&q=80"), # bowl yogur
    @("tostada.jpg",        "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80"), # tostada aguacate
    @("cafe.jpg",           "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"), # café
    @("vino-tinto.jpg",     "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80"), # vino tinto
    @("tabla-quesos.jpg",   "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80"), # tabla de quesos
    @("tarta-queso.jpg",    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80"),   # tarta de queso
    @("tiramisu.jpg",       "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80"), # tiramisú
    @("fondant.jpg",        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80"), # fondant/coulant
    @("menu-infantil.jpg",  "https://images.unsplash.com/photo-1563379091339-03246963d651?w=800&q=80"), # menú infantil - nuggets
    @("verduras.jpg",       "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"), # verduras a la brasa/grill
    @("patatas-bravas.jpg", "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&q=80")  # patatas fritas (ya corregido)
)

$headers = @{"User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
$ok = 0
$fail = 0

foreach ($item in $images) {
    $file = $item[0]
    $url  = $item[1]
    $path = Join-Path $dest $file
    try {
        Invoke-WebRequest -Uri $url -OutFile $path -Headers $headers -TimeoutSec 15 -ErrorAction Stop
        Write-Host "✓ $file" -ForegroundColor Green
        $ok++
    } catch {
        Write-Host "✗ $file — $_" -ForegroundColor Red
        $fail++
    }
}

Write-Host "`n✓ $ok OK, ✗ $fail errores" -ForegroundColor Cyan
