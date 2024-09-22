
import { faDesktop, faMobileAlt, faUtensils } from '@fortawesome/free-solid-svg-icons';

const trafficShares = [
    { id: 1, label: "In-person", value: 0, color: "secondary", icon: faUtensils },
    { id: 2, label: "To-go", value: 0, color: "primary", icon: faMobileAlt }
];

const totalOrders = [
    { id: 1, label: "July", value: [0,0,0,0,0,0], color: "primary" },
    { id: 2, label: "August", value: [0, 0, 0, 0, 0, 0], color: "secondary" }
];

export {
    trafficShares,
    totalOrders
};