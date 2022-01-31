var Note = React.createClass({
    getInitialState: function(){
        return {editing: false}
    },  
    componentWillMount: function() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 150) +'px',
            top: this.randomBetween(0, window.innerHeight - 150) +'px',
            transform: `rotate(${this.randomBetween(-15,-15)}deg)`
        }
    },
    componentDidMount : function(){
        $(this.getDOMNode()).draggable()
    },
    randomBetween: function(min, max){
        return (min + Math.ceil(Math.random() * max))
    },
    edit: function(){
        this.setState({editing : true})
    },
    save: function(){
        this.props.onChange(this.refs.newText.getDOMNode().value,this.props.index);
        this.setState({editing : false})
    },  
    remove: function(){
        this.props.onRemove(this.props.index);
    },
    renderDisplay:function(){
        return(
            <div className="note" style={this.style}>
                <p>{this.props.children}</p>
                <span>
                    <button className="btn btn-primary" onClick={this.edit}>edit</button>
                    <button className="btn btn-danger" onClick={this.remove}>trash</button>
                </span>
            </div>
        );
    },
    renderForm: function(){
        return(
            <div className="note" style={this.style}>
                <textarea ref="newText" defaultValue={this.props.children} className="form-control"></textarea>
                <button onClick={this.save} className="btn btn-success btn-sm">save</button>
            </div>
        );
    },
    render: function(){
        if (this.state.editing){
            return this.renderForm();
        } else {
            return this.renderDisplay();
        }
    }
});

var Board = React.createClass({
    propTypes: {
        count: function(props,propsName){
            if (typeof props[propsName] !== "number") {
                return new Error('The count property must be a number!')
            }
            if (props[propsName] > 100) {
                return new Error('Creating ' + props[propsName] + 'notes is not a good idea!')
            }
        }
    },
    getInitialState: function(){
        return {
            note: []
        };
    },
    nextId: function(){
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    componentWillMount: function() {
        var self = this;
        if(this.props.count){
            $.getJSON("http://beconipsum.com/api/?type=all-meat$sentences=" + this.props.count + "&start-with-lorem=1&callback=?", function(result){
                result[0].split('. ').forEach(function(sentence){
                    self.add(sentence.substring(0,40))
                });
            });
        }
    },
    add: function(Text){
        var array = this.state.note;
        array.push({
            id: this.nextId(),
            note: Text
        });
        this.setState({note: array});
    },
    update: function(newText, i){
        var array = this.state.note
        array[i].note = newText;
        this.setState({note: array});
    },
    remove: function(i){
        var array = this.state.note;
        array.splice(i, 1);
        this.setState({note: array});
    },
    eachNote: function(note, i){
        return (
            <Note key={note.id} index={i} onChange={this.update} onRemove={this.remove}>{note.note}</Note>
        );
    },
    render:function(){
        return (
            <div className="board">
                {this.state.note.map(this.eachNote)}
                <button className="btn float-end btn-light m-2 font-monospace" onClick={this.add.bind(null, "New Note")}>add</button>
            </div>
        )
    }
})

React.render(<Board count={10} />,document.getElementById('react-container'))