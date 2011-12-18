define(['./vlog', './Tank'], function(vlog, Tank) {
  var canvas,
    context,
    toClear = []; // номера клеток, которые будут очищены
  var staticDir = document.location.port ? '/' : 'static/'; // Node or Lighty?
  var image = new Image(),
    tile_map = [],
    cell_size = 60,
    is_loaded = false;

  function init(callback) {
    image.addEventListener('load', function() {
      sheetLoaded();
      if (typeof callback === 'function') {
        callback();
      }
    } , false);
    image.src = staticDir + 'img/sheet.png';
  };

  function renderField(rect) {
    if (!rect) {
      render({ tiles: toClear });
    } else {
      render(rect);
    }
  };

  function center() {
    canvas.style.left = Math.max(0, 0.5 * (document.width - canvas.clientWidth)) + 'px';
    canvas.style.top  = Math.max(0, 0.5 * (document.height - canvas.clientHeight)) + 'px';
  };

  function clear(cells) {
    if (cells && !isNaN(cells.x) && !isNaN(cells.y) && !isNaN(cells.width) && !isNaN(cells.height)) {
      for (var x = cells.x; x < cells.width + cells.x; x += 1) {
        for (var y = cells.y; y < cells.height + cells.y; y += 1) {
          if (x > -1 && x < 10 && y > -1 && y < 10 && toClear.indexOf(x + y * 10) == -1) {
            toClear.push(x + y * 10);
          }
        }
      }
    } else {
      cells.forEach(function(cell) {
        if (toClear.indexOf(cell) == -1) {
          toClear.push(cell);
        }
      });
    }
  };
  /*
  function dontClear(cells) {
    cells.forEach(function(cell) {
      if (toClear.indexOf(cell) != -1) {
        toClear.splice(toClear.indexOf(cell), 1);
      }
    });
  };
  */

  function sheetLoaded() {
    image.tileWidth = Math.floor(image.naturalWidth / cell_size);
    image.tileHeight = Math.floor(image.naturalHeight / cell_size);
    is_loaded = true;
    vlog.log('tiles loaded');
    tile_map =  [[29,1,1,1,1,1,1,1,1,30],
                [29,1,1,1,1,1,1,1,1,1],
                [29,1,1,1,1,1,1,1,1,1],
                [29,1,1,1,1,1,1,1,1,1],
                [29,1,1,1,1,1,1,1,1,30],
                [29,1,1,25,26,1,1,1,1,30],
                [29,1,1,1,1,1,1,1,1,30],
                [1,1,1,1,1,1,1,1,1,30],
                [1,1,1,1,1,1,1,1,1,30],
                [29,1,1,1,1,1,1,1,1,30]];

    canvas = document.getElementById('canvasOne');
    if (!canvas || !canvas.getContext) {
      vlog.log('Canvas element not found');
      return false;
    }
    context = canvas.getContext('2d');
    renderField({ x: 0, y: 0, width: 10, height: 10 });
    require('./MainLoop').pushClear(renderField);
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
          context.drawImage(image,
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
        context.drawImage(image,
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
      { x: Math.floor(tank.pos.x / cell_size), y: Math.floor(tank.pos.y / cell_size) }, // top left
      { x: Math.floor((tank.pos.x + tank.width()) / cell_size), y: Math.floor(tank.pos.y / cell_size) }, // top right
      { x: Math.floor(tank.pos.x / cell_size), y: Math.floor((tank.pos.y + tank.height()) / cell_size) }, // bottom left
      { x: Math.floor((tank.pos.x + tank.width()) / cell_size), y: Math.floor((tank.pos.y + tank.height()) / cell_size) }, // bottom right
    ];
    for (var i = 0; i < cells.length; i += 1) {
      if (cells[i].x < 0) {
        tank.pos.x = 0;
        return true;
      } else if (cells[i].x >= tile_map[0].length) {
        tank.pos.x = cell_size * tile_map[0].length - tank.width();
        return true;
      } else if (cells[i].y < 0) {
        tank.pos.y = 0;
        return true;
      } else if (cells[i].y >= tile_map.length) {
        tank.pos.y = cell_size * tile_map.length - tank.height();
        return true;
      } else if (!isRoad(tile_map[cells[i].y][cells[i].x])) {
        switch (i) {
          case 0:
            if (tank.width() > tank.height()) { // horizontal position - move to the right from cell
              tank.pos.x = cells[i].x * cell_size + cell_size;
            } else { // vertical
              tank.pos.y = cells[i].y * cell_size + cell_size; // to the down from cell
            }
          break;
          case 1:
            if (tank.width() > tank.height()) { // horizontal
              tank.pos.x = cells[i].x * cell_size - tank.width(); // to the left
            } else { // vertical
              tank.pos.y = cells[i].y * cell_size + cell_size; // to the down
            }
          break;
          case 2:
            if (tank.width() > tank.height()) { // horizontal
              tank.pos.x = cells[i].x * cell_size + cell_size; // to the right
            } else { // vertical
              tank.pos.y = cells[i].y * cell_size - tank.height(); // to the up
            }
          break;
          case 3:
            if (tank.width() > tank.height()) { // horizontal
              tank.pos.x = cells[i].x * cell_size - tank.width(); // to the left
            } else { // vertical
              tank.pos.y = cells[i].y * cell_size - tank.height(); // to the up
            }
          break;
        }
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
    collide: collide,
    // from Map
    init: init,
    renderField: renderField,
    width: function() { return canvas.clientWidth; },
    height: function() { return canvas.clientHeight; },
    blockSize: function() { return cell_size; },
    center: center,
    context: function() { return context; }, // TODO: this is very bad! makes object too open
    clear: clear
    // /fromMap
  };
});
