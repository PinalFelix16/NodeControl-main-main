import React from "react";
import PropTypes from "prop-types";

export default function ClasesCard({
  statSubtitle,
  statTitle,
  statArrow,
  statPercent,
  statPercentColor,
  statDescripiron,
  statIconName,
  statIconColor,
  statSchedule,
  handleDelete
}) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                {statSubtitle}
              </h5>
              {Array.isArray(statSchedule) 
  ? statSchedule.map((item, i) => (
      <React.Fragment key={i}>
        <span className="normal-case font-semibold text-lg text-blueGray-700">
          {item.nombre} : 
        </span> 
        <span className="text-lg text-blueGray-700">
          {item.informacion}
        </span> 
        <span className="font-semibold text-lg text-blueGray-700">
          / {item.nombre_maestro}
        </span>
        <br/>
      </React.Fragment>
    ))
  : null
}


            
             
            </div>
          </div>
          <p className="text-lg float-right text-blueGray-400 mt-4">
            <span className={"text-emerald-500 mr-2"}>
              
              ${statPercent}
            </span>
            <span className="whitespace-nowrap"></span>
          </p>
        </div>
      </div>
    </>
  );
}

ClasesCard.defaultProps = {
  statSubtitle: "Traffic",
  statTitle: "350,897",
  statArrow: "up",
  statPercent: "3.48",
  statPercentColor: "text-emerald-500",
  statDescripiron: "Since last month",
  statIconName: "far fa-chart-bar",
  statIconColor: "bg-red-500",
  statSchedule: ""
};

ClasesCard.propTypes = {
  statSubtitle: PropTypes.string,
  statTitle: PropTypes.string,
  statArrow: PropTypes.oneOf(["up", "down"]),
  statPercent: PropTypes.string,
  // can be any of the text color utilities
  // from tailwindcss
  statPercentColor: PropTypes.string,
  statDescripiron: PropTypes.string,
  statIconName: PropTypes.string,
  // can be any of the background color utilities
  // from tailwindcss
  statIconColor: PropTypes.string,
  statSchedule: PropTypes.string
};
