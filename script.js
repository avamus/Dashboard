import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mmbluqkupxdgkdkmwzvj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loadData() {
    const { data, error } = await supabase
        .from('Call Logs')
        .select('*');

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);
    console.error(error);

    document.getElementById('Engagement').textContent = `${data[0].Engagement}/100`;
    document.getElementById('Objection Handling').textContent = `${data[0].Objection_Handling}/100`;
    document.getElementById('Information Gathering').textContent = `${data[0].Information_Gathering}/100`;
    document.getElementById('Program Explanation').textContent = `${data[0].Program_Explanation}/100`;
    document.getElementById('Closing Skills').textContent = `${data[0].Closing_Skills}/100`;
    document.getElementById('Overall Effectiveness').textContent = `${data[0].Overall_Effectiveness}/100`;

    const average = (data[0].Engagement + data[0].Objection_Handling + data[0].Information_Gathering + data[0].Program_Explanation + data[0].Closing_Skills + data[0].Overall_Effectiveness) / 6;
    document.getElementById('average-success').textContent = `${average.toFixed(2)}%`;

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Engagement', 'Objection Handling', 'Information Gathering', 'Program Explanation', 'Closing Skills', 'Overall Effectiveness'],
            datasets: [{
                label: 'Ratings',
                data: [data[0].Engagement, data[0].Objection_Handling, data[0].Information_Gathering, data[0].Program_Explanation, data[0].Closing_Skills, data[0].Overall_Effectiveness],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
}

window.onload = loadData;

