var Map = (function() {
    var image = new Image(),
        tile_map = [],
        block_size = 60,
        is_loaded = false;

    image.addEventListener('load', sheetLoaded, false);
    image.src = 'img/sheet.png';

    function sheetLoaded() {
        image.tileWidth = Math.floor(image.naturalWidth / block_size);
        image.tileHeight = Math.floor(image.naturalHeight / block_size);
        is_loaded = true;
        vLog.log('tiles loaded');
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
            for (x = Math.max(0, rect.x); x < Math.min(10, rect.x + rect.width); x += 1) {
                for (y = Math.max(0, rect.y); y < Math.min(10, rect.y + rect.height); y += 1) {
                    n_tile = tile_map[y][x] - 1;
                    /* context.fillStyle = (x % 2 + y % 2) % 2 ? '#000000' : '#ffffff';
                    context.fillRect(x * block_size, y * block_size, block_size, block_size); */
                    CanvasBlackjack.context().drawImage(image,
                                      (n_tile % image.tileWidth) * block_size,
                                      Math.floor(n_tile / image.tileWidth) * block_size,
                                      block_size,
                                      block_size,
                                      x * block_size,
                                      y * block_size,
                                      block_size,
                                      block_size);
                }
            }
        } else if(rect && rect.tiles && rect.tiles.length) {
            rect.tiles.forEach(function(tile) {
                x = tile % 10;
                y = Math.floor(tile / 10);
                n_tile = tile_map[y][x] - 1;
                /* context.fillStyle = (x % 2 + y % 2) % 2 ? '#000000' : '#ffffff';
                context.fillRect(x * block_size, y * block_size, block_size, block_size); */
                CanvasBlackjack.context().drawImage(image,
                                  (n_tile % image.tileWidth) * block_size,
                                  Math.floor(n_tile / image.tileWidth) * block_size,
                                  block_size,
                                  block_size,
                                  x * block_size,
                                  y * block_size,
                                  block_size,
                                  block_size);
            });
            toClear = [];
        }
    };

    function data() {
      return {};
    };

    return {
        // load: load,
        render: render,
        data: data
    };
} ());
