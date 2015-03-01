var Tile = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onMouseOver: React.PropTypes.func,
    onClick: React.PropTypes.func
  },

  onMouseOver: function() {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(this.props.index);
    }
  },

  onClick: function() {
    if (this.props.onClick) {
      this.props.onClick(this.props.color);
    }
  },

  render: function() {
    var style = {backgroundColor: this.props.color};
    return (
      <div className="tile" onMouseOver={this.onMouseOver} onClick={this.onClick} style={style}>
      </div>
    );
  }
});

var Palette = React.createClass({
  onClick: function(color) {
    this.props.onClick(color);
  },

  render: function() {
    var tiles = this.props.colors.map(function(color) {
      return <Tile key={color} color={color} onClick={this.onClick} />
    }.bind(this));
    return (
      <div className="palette">
        {tiles}
      </div>
    );
  }
});

var Board = React.createClass({
  getInitialState: function() {
    return {
      active: false,
      tilesData: this.generateTilesData(),
      hue: [0, 1, 2, 3, 4, 5],
      hueMap: {
        'random': [0, 1, 2, 3, 4, 5],
        'red': [0, 1],
        'green': [2, 3],
        'blue': [4, 5],
        'yellow': [0, 1, 2, 3]
      }
    };
  },

  componentDidMount: function() {
    window.addEventListener('keydown', this.handleSpace);
  },

  generateTilesData: function() {
    if (!this.props.tilesData) {
      var windowHeight = window.innerHeight,
          windowWidth = window.innerWidth,
          tileSize = 52,
          lineLength = Math.floor(windowWidth / tileSize),
          columnHeight = Math.floor(windowHeight / tileSize),
          tileAmount = lineLength * columnHeight;

      var tilesData = {};
      for (var i = 0; i < tileAmount; i++) {
        tilesData[i] = '#808080';
      }
      return tilesData;
    } else {
      return this.props.tilesData;
    }
  },

  generateColor: function() {
    var hexa = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'],
      color = [0, 0, 0, 0, 0, 0];

    this.state.hue.forEach(function(index) {
      var code = Math.floor(Math.ceil(Math.random() * 10) * 1.4);
      color[index] = hexa[code];
    });

    return '#' + color.join('');
  },

  changeTileColor: function(index) {
    if (this.state.active) {
      tmp = this.state.tilesData;
      tmp[index] = this.generateColor();
      this.setState({tilesData: tmp});
    }
  },

  changePaletteColor: function(color) {
    if (this.state.hue == this.state.hueMap[color]) {
      this.resetPaletteColor();
    } else {
      this.setState({hue: this.state.hueMap[color]});
    }
  },

  resetPaletteColor: function() {
    this.setState({hue: this.state.hueMap['random']});
  },

  handleSpace: function(e) {
    if (e.which == 32) {
      e.preventDefault();
      this.setState({active: !this.state.active});
    }
  },

  render: function() {
    var tiles = [];

    for (var i in this.state.tilesData) {
      tiles.push(
        <Tile key={i} color={this.state.tilesData[i]} active={this.state.activeState} index={i} onMouseOver={this.changeTileColor} />
      );
    };

    return (
      <div onKeyPress={this.handleSpace}>
        <Palette onClick={this.changePaletteColor} colors={['red', 'green', 'blue']} />
        {tiles}
      </div>
    );
  }
});

React.render(
  <Board />,
  document.getElementById('content')
);
