/* eslint no-console: "off", no-undef: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
import{Pie} from'react-chartjs-2';

export default class PieChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            percent: this.props.percentual
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.percentual !== this.state.percent) {
            this.setState({percent: nextProps.percentual});
        }


    }

    render() {
        const data = {
            labels: [
                'Respondido',
                'Não Respondido'
            ],
            datasets: [{
                data: this.state.percent,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ]
            }]
        };

        const legend = {
            position: 'bottom'
        };

        const options = {
            tooltips: {
                callbacks: {
                    afterLabel: function(tooltipItems, data) {
                        return'%';
                    }
                }
            },
            plugins: {
                datalabels: {
                    color: 'white',
                    display: function(context) {
                        let dataset = context.dataset;
                        let count = dataset.data.length;
                        let value = dataset.data[context.dataIndex];
                        return value > count * 1.5;
                    },
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value, context) {
                        return Math.round(value) + '%';
                    },
                }
            }
        };

        return(
            <Pie
                data={data}
                legend={legend}
                options={options}
                width={900}
                height={300}
            />
        );
    }
}
