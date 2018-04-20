import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
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
					<div>Events:</div>
					{
						anno.map( (annotation) => {
							return (
								<div className="annotationListing" key={annotation["@id"]}>
									<div className="annotationTarget">
										{ 
											annotation["oa:hasTarget"].map( 
												(t) => { 
													if(t["@id"] in this.props.score.componentTargets) { return (
														<span 
															className = {annotation["oa:motivatedBy"]["@id"].replace(":", "_")} 
															title={t["@id"]} 
															key={t["@id"]}	
															onClick={ () => { 
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
											(at { annotation["dct:created"] })
										</span>
									</div>
								</div>
							)
						})
					}
				</div>
			)
		}
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
