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

    var WordsTable = React.createClass({
        getInitialState: function(){
            return {words: []}
        },
        componentDidMount: function(){
            this.setState({words: words});
        },
        updateWord: function (value, index, lang) {
            var state = this.state;
            console.log(state)
            if(lang == "en"){
                state.words[index].english = value;
            }else if(lang =="fr"){
                state.words[index].french = value;
            }

            this.setState(state);
            console.log(state);
        },
        render: function () {
            var rows;
            var that = this;
            if (this.state.words.length > 0)
                rows = this.state.words.map(function (word, index) {
                    return <Row word={word} index={index} updateWord={that.updateWord}/>
                });
            else {
                rows = <tr>
                    <td colSpan="3">Sorry ... no data</td>
                </tr>;
            }
            return (
                <div>
                    <table className="table table-striped table-bordered">
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
                    <button onClick={this.show}>jkhkj</button>
                </div>)
        },
        show: function(){
            console.log(this.state.words);

        }
    });

    var Row = React.createClass({
        render: function () {
            return (
                <tr>
                    <EditableField fieldValue={this.props.word.english}
                                   index={this.props.index}
                                   lang="en"
                                   updateField={this.props.updateWord}/>
                    <EditableField fieldValue={this.props.word.french}
                                   index={this.props.index}
                                   lang="fr"
                                   updateField={this.props.updateWord}/>
                    <td><Recorder idKey={this.props.index}/></td>
                </tr>);
        }
    });

    var EditableField = React.createClass({

        getInitialState: function () {
            return {editMode: false};
        },
        turnOnEditMode: function (e){
            console.log("onClick");
            this.setState({editMode: true});
        },
        changeHandler: function(e){
            console.log("onChange to: "+e.target.value);
            this.props.updateField(e.target.value, this.props.index, this.props.lang);
        },
        turnOffEditMode: function (e){
            this.setState({editMode: false});
        },
        turnOffEditModeOnKeyDown: function (e){
            if(e.keyCode == 13)
                this.setState({editMode: false});
        },
        render: function(){
            return (
                <td onDoubleClick={this.turnOnEditMode}>
                    {this.state.editMode?
                        <input autoFocus
                               onBlur={this.turnOffEditMode}
                               onKeyDown={this.turnOffEditModeOnKeyDown}
                               onChange={this.changeHandler}
                               value={this.props.fieldValue}/>
                        : <span>{this.props.fieldValue}</span>}
                </td>);
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

    React.render(<WordsTable />, document.getElementById("app"));
})();