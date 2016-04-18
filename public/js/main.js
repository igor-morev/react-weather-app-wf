(function() {
	var arr = [];
	var localTowns = JSON.parse(localStorage["towns"]);
	arr = localTowns;


	var WeatherApp = React.createClass({
		render() {
			return (<div>
					<h1>Погода на завтра</h1>
					<small>Введите название города</small>
					<QueryForm/>
				</div>);
		}
	});

	var QueryForm = React.createClass({
		formSubmit(e) {
			e.preventDefault();
		},
		getInitialState() {
			return {
				class: "hidden",
				apiTown: {
						id: "",
						name: "",
						temp: "",
						weather: "",
						data: ""
					}
			};
		},
		addToLocal() {
			if (this.state.apiTown.name == "") return;

			for(var i = 0, l = arr.length; i < l; ++i){
			    if (this.state.apiTown.id === arr[i].id) {
			    	console.log("Извините, но такой город уже есть");
		        	return;
	        	}
		   	}

		   	arr.push(this.state.apiTown);
		   	localStorage["towns"] = JSON.stringify(arr);
		   	localTowns = JSON.parse(localStorage["towns"]);

		   	this.forceUpdate();
		},
		deleteTown(index) {
			arr.splice(index, 1);
			localStorage["towns"] = JSON.stringify(arr);
			localTowns = JSON.parse(localStorage["towns"]);
			
			this.forceUpdate();
		},
		getWeatherData(e) {
			e.preventDefault();

			var currentValue = e.target.value;
			if (currentValue == "") return;

			$.ajax({
				url: "http://api.openweathermap.org/data/2.5/forecast/city?id=524901&APPID=0dbb227b5ba47ff4c5dae7676f6f4614&q=" + currentValue + "",
				dataType: 'json',
				cache: false,
				success: function(data) {
					this.setState({
						apiTown: {
							id: data.city.id,
							name: data.city.name,
							temp: data.list[8].main.temp,
							weather: data.list[8].weather[0].main,
							data: data.list[8].dt_txt
						}
					})
					
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(status, err.toString());
				}.bind(this)
		    });

		},
		render() {
			var getList = function(town, index) {
				return (
					<div key={town.id} className="col-md-4 item">
						<div className="panel panel-default">
							<div className="panel-body">
								<h4>Город: {town.name}</h4>
								<p>Температура: {town.temp}</p>
								<p>Погода: {town.weather}</p>
								<p><small>Дата: {town.data}</small></p>
								<p><button onClick={this.deleteTown.bind(null, index)} className="btn btn-danger">Удалить город</button></p>
							</div>
						</div>

					</div>)
			}.bind(this)
			return (
				<div>
					<form className="row" onSubmit={this.formSubmit}>
						<div className="form-group col-md-6">
							<input onChange={this.getWeatherData} className="form-control" type="text"/>
							<span className="label label-success">{this.state.apiTown.name}</span>
						</div>
						<div className="form-group col-md-3">
							<button className="btn btn-primary" onClick={this.addToLocal}>Добавить город</button>
						</div>
					</form>
					<div className="row">
						{localTowns.map(getList)}
					</div>
				</div>);
		}
	});

	ReactDOM.render(<WeatherApp/>, document.getElementById("weather-app"));

})();

