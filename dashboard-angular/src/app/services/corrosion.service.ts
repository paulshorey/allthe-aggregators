import { Injectable, EventEmitter } from "@angular/core";
/*
	const
*/
const USE_REMOTE_SERVER = false;
const BEAPIURL = "http://" + (USE_REMOTE_SERVER ? "10.1.111.59" : "localhost") + ":5000/calculate";
/*
	lib
*/
function fetchWithTimeout(url, options, timeout) {
	return new Promise((resolve, reject) => {
		fetch(url, options)
			.then(resolve)
			.catch(reject);
		if (timeout) {
			const e = new Error("Connection timed out");
			setTimeout(reject, timeout, e);
		}
	});
}
/*
	class
*/
@Injectable({
	providedIn: "root"
})
export class CorrosionService {
	/*






	front-end model >>>






	*/
	status = {
		/*
			status:
		*/
		lifetime_manufacturer: 10,
		lifetime_corrected: 10,
		lifetime_correctedProb: 100,
		classList: "",
		lifetimes_calculated: [
			{
				lifetime: 10,
				probability: 100
			}
		],
		corrections: [
			{
				type: "add corrosion inhibitor",
				amount: 1,
				constraintPerUnit: 100,
				constraintUpperLimit: 10000
			}
		],
		problems: [],
		solutions: [],
		/*
			depreciated:
		*/
		lifetime_calculated: 10,
		lifetime_calculatedProb: 100,
		lifetime_calculatedWorst: null,
		lifetime_calculatedWorstProb: null,
		correction_corrosionInhibitor: {
			constraintPerUnit: 100,
			constraintUpperLimit: 10000,
			add: 0,
			per: 0
		}
	};
	statusOriginal: any = {};
	statusUpdated = new EventEmitter();
	/*
		measurements:
	*/
	measurements = {
		h2o: {
			id: "h2o",
			name: "H2O",
			unit: "%",
			value: 0,
			statusOk: 0,
			statusBad: 5,
			statusDanger: 10,
			statusAlert: 15
		},
		h2s: {
			id: "h2s",
			name: "H2S",
			unit: "%",
			value: 0,
			statusOk: 0,
			statusBad: 0.5,
			statusDanger: 1,
			statusAlert: 1.5
		},
		salt: {
			id: "salt",
			name: "Salt",
			unit: "ppm",
			value: 0,
			statusOk: 0,
			statusBad: 100,
			statusDanger: 500,
			statusAlert: 1000
		},
		temperature: {
			id: "temperature",
			name: "Temp.",
			unit: "°C",
			value: 289,
			statusOk: 289,
			statusBad: 290,
			statusAlert: 291
		}
	};
	constructor() {
		this.statusOriginal = Object.assign({}, this.status);
	}
	/*






	public classes - user input






	*/
	public set_measurement(measurement) {
		var m = measurement;
		this.measurements[m.id] = Object.assign({}, this.measurements[m.id], m);
	}
	public get(what) {
		if (what === "status") {
			return this.status;
		} else if (what === "measurements") {
			return this.measurements;
		}
	}
	public set_status_correction_corrosionInhibitor(key, value) {
		value = value / 1;
		if (value < 0) {
			value = 0;
		}
		if (key === "constraintUpperLimit") {
			if (value < this.status.correction_corrosionInhibitor.constraintPerUnit) {
				value = this.status.correction_corrosionInhibitor.constraintPerUnit;
			}
		}
		this.status.correction_corrosionInhibitor[key] = value;
		this.statusUpdated.emit(this.status);
	}
	/*



		


		public classes - no user input, use existing data






	*/
	public async calculate_corrosionInhibitor() {
		/*
			calculate
		*/
		this.set_constraints_corrosionInhibitor();
		/*
			emit
		*/
		this.statusUpdated.emit(this.status);
	}
	public async calculate_measurements() {
		/*
			request
		*/
		var request = {
			constraint_per_unit: this.status.correction_corrosionInhibitor.constraintPerUnit,
			constraint_upper_limit: this.status.correction_corrosionInhibitor.constraintUpperLimit,
			measurements: []
		};
		for (let k in this.measurements) {
			let v = this.measurements[k];
			if (v.value || v.value === 0) {
				request.measurements.push({
					id: v.id,
					value: v.value
				});
			}
		}
		console.log("request", request);
		/*
			fetch
		*/
		var fetchWait = 3000;
		if (USE_REMOTE_SERVER) {
			fetchWait = 300;
		}
		var res = await fetch(BEAPIURL, {
			body: JSON.stringify(request),
			cache: "no-cache",
			headers: {
				"content-type": "application/json"
			},
			method: "POST",
			mode: "cors"
		});
		/*
			response
		*/
		var response = await res.json();
		(<any>window).response = response;
		console.log("response", response);
		this.set_status_backend(response);
		/*
			calculate
		*/
		if (response.lifetimeCalculated && response.lifetimeCalculated[0]) {
			// back-end
			this.set_status_backend(response);
		} else {
			// front-end
			var e = "Bad response from server. Expecting lifetimeCalculated to be array of numbers.";
			var err = "API request failed with error: " + e + "... Will use 'mock' 'dummy' front-end logic";
			console.warn(err);
			alert(err);
			return;
		}
		/*
			emit
		*/
		this.statusUpdated.emit(this.statusOriginal);
		setTimeout(() => {
			console.log("this.status", this.status);
			this.statusUpdated.emit(this.status);
		}, 150);
	}
	/*



		


		private classes - logic and calculations






	*/
	reset_status() {
		this.status = Object.assign({}, this.statusOriginal);
		this.status.problems = [];
		this.status.solutions = [];
	}
	set_constraints_corrosionInhibitor = () => {
		this.status.correction_corrosionInhibitor.constraintUpperLimit = this.status.correction_corrosionInhibitor.constraintPerUnit * this.status.correction_corrosionInhibitor.add;
	};
	set_status_backend = response => {
		// first reset
		this.reset_status();
		this.set_constraints_corrosionInhibitor();
		// important details
		// this.status.lifetimes_calculated = [];
		// response.lifetimeCalculated.forEach((val, i) => {
		// 	this.status.lifetimes_calculated.push({
		// 		lifetime: response.lifetimeCalculated[i],
		// 		probability: response.lifetimeCalculatedProb[i]
		// 	});
		// });
		this.status.correction_corrosionInhibitor.add = response.corrosionInhibitor / 1;
		this.status.lifetime_calculated = response.lifetimeCalculated[0] / 1;
		this.status.lifetime_calculatedProb = response.lifetimeCalculatedProb[0] / 1;
		this.status.lifetime_calculatedWorst = response.lifetimeCalculated[1] / 1;
		this.status.lifetime_calculatedWorstProb = response.lifetimeCalculatedProb[1] / 1;
		this.status.lifetime_corrected = response.lifetimeCorrected / 1;
		this.status.lifetime_correctedProb = response.lifetimeCorrectedProb / 1;
		this.status.lifetime_manufacturer = response.lifetimeManufacturer / 1;
		/// classList
		if (this.status.lifetime_calculatedWorst || this.status.lifetime_calculated < this.status.lifetime_manufacturer) {
			this.status.classList += " status-bad";
		} else {
			this.status.classList += " status-ok";
		}
	};
}
