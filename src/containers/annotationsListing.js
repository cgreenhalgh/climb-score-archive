import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import hdate from 'human-date';

import { scorePageToComponentTarget } from 'meld-clients-core/src/actions/index';

class AnnotationsListing extends Component {
	constructor(props) { 
		super(props);
	}

	render() { 
		if(Object.keys(this.props.score).length && Object.keys(this.props.score.componentTargets).length) { 
			// filter out undefined annotations
			const anno = annotations.filter( (annotation) => { return annotation })
			// order by timestamp
			anno.sort(function(a, b) { return a["dct:created"] < b["dct:created"] ? -1 : 1 })
			return ( 
				<div className="annotationsWrapper">
					<div>{this.props.label}</div>
					{
						anno.map( (annotation) => {
							const timestamp = new Date(annotation["dct:created"]);
							return (
								<div className="annotationListing" key={annotation["@id"]}>
									<div className="annotationTarget">
										{ 
											annotation["oa:hasTarget"].map( 
												(t) => { 
													if(t["@id"] in this.props.score.componentTargets) { return (
														<span 
															className = 
																{annotation["oa:motivatedBy"]["@id"].replace(":", "_") + " " +
																this.props.score.componentTargets[t["@id"]]["muzicodeType"]["@id"].replace(":", "_") }
															title={t["@id"]} 
															key={t["@id"]}	
															onClick={ (e) => { 
																console.log("WHEE", e.target)
																document.querySelectorAll(".annotationTarget span").forEach( (t) => t.classList.remove("active") );
																e.target.classList.add("active");

																this.props.scorePageToComponentTarget(
																	// TODO: Implement "startsWith" to pick correct
																	// first MEI target in future
																	this.props.score.componentTargets[t["@id"]]["MEI"][0],
																	this.props.scoreUri,
																	this.props.score.MEI[this.props.scoreUri]
																)
															}}>
																	{this.props.score.componentTargets[t["@id"]]["description"]}
															</span> 
													)}
													else { return <span>Muzicode triggered</span> }
												}
											)  
										}
										<span className="timestamp" key={annotation["@id"] + "_time"}> 
											at { timestamp.getHours().toString().padStart(2, 0) + ":" + 
											   timestamp.getMinutes().toString().padStart(2, 0) + ":" +
											   timestamp.getSeconds().toString().padStart(2, 0) + " on " +
											   hdate.prettyPrint(timestamp) }
										</span>
									</div>
								</div>
							)
						})
					}
				</div>
			)
		} else { return <div>{ this.props.label }</div>  }
		return <div/>
	}
}

function mapStateToProps({ score }) {
	return { score }
}

function mapDispatchToProps(dispatch) { 
	return bindActionCreators({ scorePageToComponentTarget }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationsListing);
