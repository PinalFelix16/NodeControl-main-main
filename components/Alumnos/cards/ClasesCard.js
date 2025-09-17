// components/Alumnos/cards/ClasesCard.js
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
  handleDelete,
}) {
  // Normaliza: siempre un array
  const schedule = React.useMemo(() => {
    if (Array.isArray(statSchedule)) return statSchedule;
    if (statSchedule && typeof statSchedule === "object") return [statSchedule];
    return [];
  }, [statSchedule]);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              {statSubtitle}
            </h5>

            {schedule.length === 0 ? (
              <span className="text-blueGray-400">Sin clases</span>
            ) : (
              schedule.map((item, idx) => (
                <div key={item.id_clase || item.id || idx}>
                  <span className="normal-case font-semibold text-lg text-blueGray-700">
                    {item.nombre ?? ""} :
                  </span>{" "}
                  <span className="text-lg text-blueGray-700">
                    {item.informacion ?? ""}
                  </span>{" "}
                  <span className="font-semibold text-lg text-blueGray-700">
                    / {item.nombre_maestro || item.maestro || ""}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="relative w-auto pl-4 flex-initial">
            <div
              className={
                "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                statIconColor
              }
              onClick={() => handleDelete?.()}
              style={{ cursor: "pointer" }}
            >
              <i className={statIconName} />
            </div>
          </div>
        </div>

        <p className="text-lg float-right text-blueGray-400 mt-4">
          <span className="text-emerald-500 mr-2">${statPercent}</span>
        </p>
      </div>
    </div>
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
  statSchedule: [], // <-- SIEMPRE arreglo
};

ClasesCard.propTypes = {
  statSubtitle: PropTypes.string,
  statTitle: PropTypes.string,
  statArrow: PropTypes.oneOf(["up", "down"]),
  statPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statPercentColor: PropTypes.string,
  statDescripiron: PropTypes.string,
  statIconName: PropTypes.string,
  statIconColor: PropTypes.string,
  statSchedule: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id_clase: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombre: PropTypes.string,
        informacion: PropTypes.string,
        nombre_maestro: PropTypes.string,
        maestro: PropTypes.string,
      })
    ),
    PropTypes.object, // por si te llega una sola clase como objeto
    PropTypes.any, // última red de seguridad
  ]),
  handleDelete: PropTypes.func,
};
