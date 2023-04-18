
import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";
import type { Context } from "https://edge.netlify.com";

export default async function handler(req: Request, ctx: Context): Promise<ImageResponse> {

	try {
		// The details parsed from the query
		const details = parseDetails(req);
		// The total emission
		const total = details.a + details.s + details.l + details.t + details.d;
		// The emission goal
		const goal = 2;
		// The width of the diagram bar in px
		const barWidth = 150;
		// The height of the emission diagram bar in px
		const barHeight = 420;
		// The goal diagram bar height will be calculated
		const goalBarHeight = (goal/total*barHeight);
		// The distance in px of the diagram bar from the edge
		const barDistanceFromEdge = 300;
		// The distance in px of the label above diagram bar from the edge
		const labelDistanceFromEdge = barDistanceFromEdge + barWidth/2;
		// The distance of the black floor from the bottom in px
		const floorBottom = 40;

		const lineThickness = 5;

		console.log(total);

		return new ImageResponse(
			(
				<div style={{
					background: "linear-gradient(90deg, rgb(229, 209, 57), rgb(229, 209, 57))",
					width: "100%",
					height: "100%",
					display: "flex"
	
				}}>

					<div black-floor style={{
						position: "absolute",
						bottom: floorBottom+"px",
						width: "100%",
						borderBottom: `solid ${lineThickness}px #000`
					}}/>

					<div dotted-line style={{
						position: "absolute",
						bottom: (goalBarHeight+floorBottom-lineThickness)+"px",
						borderBottom: `dashed ${lineThickness}px #000`,
						width: "100%"
					}}></div>

					<span emission-bar-label style={{
						position: "absolute",
						bottom: (floorBottom+barHeight)+"px",
						left: labelDistanceFromEdge+"px",
						color: "#000",
						fontWeight: "Bold",
						fontSize: "50px",
						transform: "translateX(-50%)",
						textAlign: "center",

					}}>
						{total} tonnes
					</span>
					<div emission-bar style={{
						position: "absolute",
						display: "flex",
						flexDirection: "column",
						bottom: floorBottom+"px",
						left: barDistanceFromEdge+"px",
						height: barHeight+"px",
						width: barWidth+"px",
						border: `solid ${lineThickness}px #000`,
						borderRadius: "10px 10px 0 0",
						overflow: "hidden"
					}}>

						<div category-alimentation style={{
							background: "rgb(229, 142, 38)",
							borderBottom: "solid 3px #000",
							flex: details.a,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden"
						}}>
							<span style={{
								fontSize: "40px",
								textAlign: "center",
							}}>
								<svg version="1.1" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
									<g stroke="#fff" fill="#fff" transform="matrix(1.2818 0 0 .99429 -10.625 .21837)">
										<g>
											<path d="m31.175 31.249c0-13.011-6.0003-25.208-6.0003-22.896 0 2.3123 1.1743 33.022 1.1743 33.022l-1.1743 20.082c0 1.3696 1.1102 2.4798 2.4798 2.4798s2.4798-1.1102 2.4798-2.4798l-0.65579-20.197c-1.24e-4 0 1.6965-2.642 1.6965-10.011z" stroke-miterlimit="10" stroke-width="2.4798"/>
											<g stroke-linecap="round">
												<path d="m48.718 8.3526s0.69899 6.2209 0.69899 11.116c0 3.6712-1.6758 4.9114-3.2649 5.8348 0 0-3.9241-0.03307-3.919 0.0072-1.5958-0.91853-3.4024-2.0693-3.4024-5.7501 0-4.8949 0.824-11.208 0.824-11.208" fill="none" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2.4798"/>
												<path d="m46.144 26.383 0.03534 35.236c0 1.3696-1.1102 2.4798-2.4798 2.4798s-2.4798-1.1102-2.4798-2.4798l1.0053-35.229s3.8753 0.12663 3.919-0.0072z" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2.4798"/>
												<path d="m43.984 24.555v-16.279" fill="none" stroke-width="2.1966"/>
											</g>
										</g>
										<path d="m38.892 20.201s2.9261 1.7076 5.1478 1.7076c2.2074 0 5.348-1.8705 5.348-1.8705-1.7075 2.4567-2.4251 4.9614-2.4251 4.9614l-5.4495-0.01471z"/>
									</g>
								</svg>
							</span>
						</div>

						<div category-logement style={{
							background: "rgb(4, 164, 172)",
							borderBottom: "solid 3px #000",
							flex: details.l,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden"
						}}>
							<svg version="1.1" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
								<path d="m36.081 13.06-21.276 19.253c-0.14486 7.2564-0.11149 16.575-0.0279 26.074l44.095 0.2418c0.05758-9.6671 0.17274-16.958 0.1302-26.625zm-12.899 22.02h10.704v23.384h-10.704zm19.469 2.5482h10.537v10.151h-10.537z" fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4874"/>
								<g transform="matrix(1.1904 0 0 1.1904 -7.1197 -5.6756)" fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2">
									<polygon points="24 17 29 17 29 21 24 26"/>
									<polygon transform="translate(-.034439 -.20575)" points="29 21 24 26 24 17 29 17"/>
								</g>
							</svg>
						</div>

						<div category-transport style={{
							background: "rgb(183, 21, 64)",
							borderBottom: "solid 3px #000",
							flex: details.t,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden"
						}}>
							<svg version="1.1" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
								<g transform="translate(.79728 1.063)">
									<path d="m36 8.0712c-15.425 0-27.929 12.504-27.929 27.929s12.504 27.929 27.929 27.929 27.929-12.504 27.929-27.929-12.504-27.929-27.929-27.929zm0 48.844c-11.551 0-20.916-9.3643-20.916-20.916s9.3642-20.916 20.916-20.916 20.916 9.3642 20.916 20.916-9.3643 20.916-20.916 20.916z" fill="#fff"/>
								</g>
								<g stroke="#fff" stroke-miterlimit="10">
									<g fill="none">
									<circle cx="36.797" cy="37.063" r="27.929" stroke-width="2"/>
									<circle cx="36.797" cy="37.063" r="21.298" stroke-width="2"/>
									<g stroke-linecap="round">
										<g stroke-width="2">
										<line x1="22.066" x2="34.672" y1="51.795" y2="39.214"/>
										<line x1="42.057" x2="37.666" y1="57.29" y2="39.728"/>
										<line x1="57.094" x2="40.125" y1="42.392" y2="38.346"/>
										</g>
										<line x1="51.57" x2="39.4" y1="22.291" y2="34.448" stroke-width="1.9855"/>
										<line x1="31.565" x2="36.246" y1="16.863" y2="33.886" stroke-width="1.9486"/>
										<line x1="16.578" x2="33.547" y1="31.811" y2="36.416" stroke-width="2"/>
									</g>
									</g>
									<circle cx="36.797" cy="37.063" r="3" fill="#fff" stroke-width="2"/>
								</g>
							</svg>
						</div>

						<div category-divers style={{
							background: "rgb(9, 132, 227)",
							borderBottom: "solid 3px #000",
							flex: details.d,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden"
						}}>
							<svg id="a" version="1.1" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
								<g fill="#fff" stroke-width="2">
									<path d="m62.342 22.453-8.8867 5.1309v28.689l8.8867-5.1309zm-25.51 14.727-0.45508 28.953 9.7285-5.6172v-28.486z"/>
									<path d="m34.81 65.719v-28.797l-25.726-14.853v28.979z"/>
									<path d="m35.895 6.2988-8.6406 4.9883 25.359 14.477 8.5-4.9062-25.219-14.559zm-16.053 9.2676-9.2793 5.3574 25.17 14.588 9.4688-5.4668-25.359-14.479z"/>
								</g>
							</svg>
						</div>

						<div category-service style={{
							background: "rgb(12, 36, 97)",
							flex: details.s,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden"
						}}>
							<svg version="1.1" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
								<g fill="#fff" stroke-miterlimit="10">
									<rect x="12" y="56" width="48" height="4"/>
									<rect x="14.13" y="22" width="43.74" height="4"/>
									<rect x="15.72" y="52" width="40.55" height="4"/>
									<polygon points="36 12 19 21.75 53 21.75" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
								</g>
								<g fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
									<rect x="11.99" y="55.89" width="48.01" height="3.993" stroke-width="2"/>
									<rect x="14.18" y="21.76" width="43.65" height="3.999" stroke-width="2.001"/>
									<rect x="15.27" y="51.76" width="41.47" height="3.993" stroke-width="2"/>
									<g stroke-width="1.702">
									<rect x="18.35" y="25.61" width="4.298" height="26.3"/>
									<rect x="27.35" y="25.61" width="4.298" height="26.3"/>
									<rect x="49.266" y="25.624" width="4.298" height="26.3"/>
									</g>
									<polygon transform="matrix(1.091 0 0 .9982 -3.283 .098)" points="36 12 19 21.75 53 21.75" stroke-width="1.916"/>
									<rect x="40.35" y="25.61" width="4.298" height="26.3" stroke-width="1.702"/>
								</g>
							</svg>
						</div>

					</div>

					<span goal-bar-label style={{
						position: "absolute",
						bottom: (goalBarHeight+floorBottom)+"px",
						right: labelDistanceFromEdge+"px",
						color: "#000",
						fontWeight: "Bold",
						fontSize: "50px",
						transform: "translateX(+50%)",
						textAlign: "center",

					}}>
						{goal} tonnes
					</span>
					<div goal-bar style={{
						position: "absolute",
						display: "flex",
						flexDirection: "column",
						bottom: floorBottom+"px",
						right: barDistanceFromEdge+"px",
						height: (goalBarHeight)+"px",
						width: barWidth+"px",
						border: `solid ${lineThickness}px #000`,
						borderRadius: "10px 10px 0 0",
						background: "rgb(120, 224, 143)",
						overflow: "hidden",
						justifyContent: "center",
						alignItems: "center"
					}}>
						<span style={{
							fontSize: "60px",
							textAlign: "center"
						}}>
							🎯
						</span>
					</div>

					<div speech-bubble style={{
						position: "absolute",
						right: "925px",
						bottom: (goalBarHeight+floorBottom+10)+"px",
						maxWidth: "250px",
						background: "rgba(255, 255, 255, 0.25)",
						padding: "15px",
						borderRadius: "25px",
						fontSize: "30px",
						textAlign: "center",
						height: "110px"
						
					}}>
						mon empreinte annuelle
					</div>

					<div speech-bubble style={{
						position: "absolute",
						left: "925px",
						top: (630 - goalBarHeight - floorBottom + 15)+"px",
						maxWidth: "250px",
						background: "rgba(255, 255, 255, 0.25)",
						padding: "15px",
						borderRadius: "25px",
						fontSize: "30px",
						textAlign: "center",
						height: "70px"
						
					}}>
						mon objectif
					</div>

				</div>
			),
			{
				width: 1200,
				height: 630,
				emoji: 'twemoji',
				// debug: true
			},
		)
	} catch(e) {
		return Response.json({error: e});
	}

}

const ValidLetters = ["a","s","l","t","d"] as const;

type DetailsKey = typeof ValidLetters[number];

type DetailsEntries = Record<DetailsKey, number>;

/** 
 * @param {Request} req - The original request where we can find the url
 * @returns {DetailsEntries} an object that contain each categorie with their value (the key is the first letter of the categorie and the value is a float)
 * @throws an string error if the details query params is missing or have incorrect value or miss a categorie
 */
function parseDetails(req:Request):DetailsEntries {

	const details = new URL(req.url).searchParams.get("details");
	
	if (details == null) throw "The details query params is missing";

	const ValidLetters = ["a","s","l","t","d"] as const;
	type DetailsKey = typeof ValidLetters[number];
	const notUsedValidLetters:DetailsKey[] = Object.assign([], ValidLetters);


	type DetailsEntries = Record<DetailsKey, number>

	const entries:Partial<DetailsEntries> = {};

	let currentKey:DetailsKey | null = null;
	let currentValue = "";
	const addEntry = () => {
			if (currentKey != null) {
					const value = parseFloat(currentValue);
					if (value > 0) entries[currentKey] = value;
					else throw "The details query params contain incorrect value";
			}
			currentKey = null;
			currentValue = "";
	}
	for (const c of details) {
			if (notUsedValidLetters.includes(c as DetailsKey)) {
					addEntry();
					removeItem(notUsedValidLetters, c);
					currentKey = c as DetailsKey;
			} else {
					currentValue = currentValue.concat(c);
			}
	}
	addEntry();
	if (notUsedValidLetters.length != 0) throw "The details query params is missing a categorie";
	return entries as DetailsEntries;

}

function removeItem<T>(arr: Array<T>, value: T): Array<T> { 
	const index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}