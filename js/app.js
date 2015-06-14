/** @jsx React.DOM */
(function () {
    'use strict';

    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
        window.URL = window.URL || window.webkitURL;

        var audio_context = new AudioContext;
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        console.log(e);
        alert('No web audio support in this browser!');
    }

    var recorderObject;
    navigator.getUserMedia({audio: true}, function (stream) {
        recorderObject = new MP3Recorder(audio_context, stream);
    }, function (e) {
    });

    var Test = React.createClass({
        render: function () {
            var rows;
            if (this.props.words.length > 0)
                rows = this.props.words.map(function (word, i, xxx) {
                    return <Row word={word} idKey={i}/>
                });
            else {
                rows = <tr>
                    <td colSpan="3">Sorry ... no data</td>
                </tr>;
            }
            return <table className="table table-striped table-bordered">
                <thead>
                <tr>
                    <th>English</th>
                    <th>French</th>
                    <th width="15%">Audio</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        }
    });

    var Row = React.createClass({

        render: function () {
            return <tr>
                <td>{this.props.word.english}</td>
                <td>{this.props.word.french}</td>
                <td><Recorder idKey={this.props.idKey}/></td>
            </tr>;
        }
    });

    var Recorder = React.createClass({
        stopIcon: "glyphicon glyphicon-stop",
        recordIcon: "glyphicon glyphicon-record",

        getInitialState: function () {
            return {state: "stopped", icon: this.recordIcon}
        },
        handleRecord: function () {
            if (this.state.state == "stopped") {
                this.setState({state: "recording", icon: this.stopIcon});
                recorderObject.init();
                recorderObject.start();

            } else {
                this.setState({state: "stopped", icon: this.recordIcon});
                recorderObject.stop();
                var $this = this;
                recorderObject.exportWAV(function (base64_wav_data) {
                    var audioUrl = 'data:audio/wav;base64,' + base64_wav_data;
                    console.log(audioUrl);
                    $this.setState({audioUrl: audioUrl});
                });
            }
        },
        playAudio: function () {
            var audio = document.getElementById(this.props.idKey);
            audio.play();
        },
        render: function () {
            var style = {
                fontSize: 20,
                marginRight: 10
            };
            console.log(this.props.idKey);

            return <div>
                <span className={this.state.icon} onClick={this.handleRecord} style={style}></span>
                <audio id={this.props.idKey} src={this.state.audioUrl}></audio>
                {this.state.audioUrl ?
                    <span className="glyphicon glyphicon-play" onClick={this.playAudio} style={style}></span> : ""}
            </div>
        }
    });

    var words = [{english: "Hello dude!", french: "Salut mec!"},
        {english: "I would like to buy 3 wines.", french: "Je voudrais acheter 3 vins."},
        {english: "borrow", french: "emprunter"},
        {english: "to be", french: "être"}];

    React.render(<Test words={words}/>, document.getElementById("app"));
})();