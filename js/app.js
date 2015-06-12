/** @jsx React.DOM */
(function () {
    'use strict';

    var Test = React.createClass({
        render: function () {
            return <div>
                <h1>Hello React</h1>
            </div>
        }
    });

    React.render(<Test/>, document.getElementById("app"));
});