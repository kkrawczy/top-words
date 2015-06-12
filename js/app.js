/** @jsx React.DOM */
(function () {
    'use strict';

    var Test = React.createClass({
        render: function () {
            var rows;
            if (this.props.words.length > 0)
                rows = this.props.words.map(function (word) {
                    return <Row word={word}/>
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
                <tbody id="tbody">
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
                <td></td>
            </tr>;
        }
    });


    var words = [{english: "Hello dude!", french: "Salut mec!"},
        {english: "I would like to buy 3 wines.", french: "Je voudrais acheter 3 vins."},
        {english: "borrow", french: "emprunter"},
        {english: "to be", french: "être"}];

    React.render(<Test words={words}/>, document.getElementById("app"));
})();