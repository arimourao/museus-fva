/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import{Line} from'react-chartjs-2';
import _ from'lodash';
import'chartjs-plugin-datalabels';

export default class ComparativeChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            years: null,
            count: null
        };
    }
    componentDidMount() {
        //Assume como dado padrão, o do último FVA realizado
        const self = this;
        $.ajax({
            url: MapasCulturais.createUrl('panel', 'fvaAnalytics'),
            type: 'GET',
            dataType:'json',
            success:function(data) {
                self.setState({
                    years: data.map((item) => item.year),
                    count: data.map((item) => item.count)
                });
            }
        });
    }

    render() {
        const data = {
            labels: this.state.years,
            datasets: [
                {
                    label: 'FVAs respondidos',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.count
                }
            ]
        };
        
        const options = {
            plugins: {
                datalabels: {
                    backgroundColor:'rgba(255, 165,165, 0.9)',
                    borderRadius: 4,
                    color: function(context) {
                        let i = context.dataIndex;
                        let value = context.dataset.data[i];
                        let prev = context.dataset.data[i - 1];
                        let diff = prev !== undefined ? value - prev : 0;
                        return diff < 0 ? 'red' :
                            diff > 0 ? 'green' :
                                'gray';
                    },
                    font: {
                        weight: 'bold'
                    },                    
                    formatter: function(value, context) {
                        let i = context.dataIndex;
                        let prev = context.dataset.data[i - 1] === 0 ? 1 : context.dataset.data[i - 1];
                        let diff = prev !== undefined ? prev - value : 0;
                        let glyph = diff < 0 ? '\u25B2' : diff > 0 ? '\u25BC' : '\u25C6';
                        return glyph + ' ' + Math.round(((value*100)/prev)-100) + '%';
                    },
                    display: function(context) {
                        if(context.dataset.data[context.dataIndex] === 0 || context.dataIndex === 0) {
                            return false;
                        }
                    }
                }
            }
        };

        return(
            (this.state.years && this.state.count) ?
                <div id="chart-years">
                    <h2>Respostas x Anos</h2>
                    <Line data={data} width={50} height={20} options={options}/>
                </div>
                :
                ''
        );
    }
}
