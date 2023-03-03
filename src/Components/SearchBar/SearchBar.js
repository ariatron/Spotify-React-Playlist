import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {term: '', isLoading: false };

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.setState({ isLoading: true});
        this.props.onSearch(this.state.term).then(() => {
            this.setState({ isLoading: false });
        });
    }

    handleTermChange(event) {
        this.setState({term: event.target.value});
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
                <button className="SearchButton" onClick={this.search}>
                    SEARCH
                </button>
            </div>
        );
    }
}

function LoadingScreen() {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0, 0,5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '2rem'
            }}
        >Searching...</div>
    );
}

export default SearchBar;