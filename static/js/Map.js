define(['./vlog', './Tank', './ExtCanvas'], function(vlog, Tank, ExtCanvas) {
  return (function() {
    var staticDir = document.location.port ? '/' : 'static/'; // Node or Lighty?
    var image = new Image(),
        tile_map = [],
        cell_size = 60,
        is_loaded = false;

    image.addEventListener('load', sheetLoaded, false);
    image.src = staticDir + 'img/sheet.png';

    function sheetLoaded() {
        image.tileWidth = Math.floor(image.naturalWidth / cell_size);
        image.tileHeight = Math.floor(image.naturalHeight / cell_size);
        is_loaded = true;
        vlog.log('tiles loaded');
        tile_map =  [[29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,25,26,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30],
                    [29,1,1,1,1,1,1,1,1,30]];
    };

    function render(rect) {
        if (!is_loaded) {
            return;
        }
        var x, y, n_tile;
        if (rect && rect.length && rect.length == 4) {
            rect = {
                x: rect[0],
                y: rect[1],
                width: rect[2],
                height: rect[3]
            };
        }
        if (rect && !isNaN(rect.x) && !isNaN(rect.y) && !isNaN(rect.width) && !isNaN(rect.height)) {
            for (x = Math.max(0, rect.x); x < Math.min(tile_map[0].length, rect.x + rect.width); x += 1) {
                for (y = Math.max(0, rect.y); y < Math.min(tile_map.length, rect.y + rect.height); y += 1) {
                    n_tile = tile_map[y][x] - 1;
                    /* context.fillStyle = (x % 2 + y % 2) % 2 ? '#000000' : '#ffffff';
                    context.fillRect(x * cell_size, y * cell_size, cell_size, cell_size); */
                    ExtCanvas.context().drawImage(image,
                                      (n_tile % image.tileWidth) * cell_size,
                                      Math.floor(n_tile / image.tileWidth) * cell_size,
                                      cell_size,
                                      cell_size,
                                      x * cell_size,
                                      y * cell_size,
                                      cell_size,
                                      cell_size);
                }
            }
        } else if(rect && rect.tiles && rect.tiles.length) {
            rect.tiles.forEach(function(tile) {
                x = tile % 10;
                y = Math.floor(tile / 10);
                n_tile = tile_map[y][x] - 1;
                /* context.fillStyle = (x % 2 + y % 2) % 2 ? '#000000' : '#ffffff';
                context.fillRect(x * cell_size, y * cell_size, cell_size, cell_size); */
                ExtCanvas.context().drawImage(image,
                                  (n_tile % image.tileWidth) * cell_size,
                                  Math.floor(n_tile / image.tileWidth) * cell_size,
                                  cell_size,
                                  cell_size,
                                  x * cell_size,
                                  y * cell_size,
                                  cell_size,
                                  cell_size);
            });
            toClear = [];
        }
    };

    // Проверяет положение танка на наличие коллизий с элементами карты
    function collide(tank) {
      var cells = [
        { x: Math.floor(tank.pos.x / cell_size), y: Math.floor(tank.pos.y / cell_size) },
        { x: Math.floor((tank.pos.x + tank.width()) / cell_size), y: Math.floor(tank.pos.y / cell_size) },
        { x: Math.floor(tank.pos.x / cell_size), y: Math.floor((tank.pos.y + tank.height()) / cell_size) },
        { x: Math.floor((tank.pos.x + tank.width()) / cell_size), y: Math.floor((tank.pos.y + tank.height()) / cell_size) },
      ];
      for (var i = 0; i < cells.length; i += 1) {
        if (cells[i].x < 0 || cells[i].x >= tile_map[0].length ||
            cells[i].y < 0 || cells[i].y >= tile_map.length ||
            !isRoad(tile_map[cells[i].y][cells[i].x])) {
          return true;
        }
      }
      return false;
    }

    // "Дорога": по данной клетке можно проехать
    function isRoad(cell_type) {
      return cell_type === 1;
    }

    function data() {
      return {};
    };

    return {
        // load: load,
        render: render,
        data: data,
        collide: collide
    };
  } ());
});
