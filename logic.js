const canvas =document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution =10;
canvas.width=1400;
canvas.height=700;
//ctx.globalAlpha=0.7;

const cols=canvas.width/resolution;
const rows=canvas.height/resolution;

let play=false;
let timer=undefined;

function buildGrid()
{
    return new Array(cols).fill(null).map(()=>new Array(rows).fill(0));
}

function nextGen(grid)
{
    let next_gen = grid.map(arr=>[...arr]);

    for (let col=0;col<grid.length;col++)
    {
        for(let row=0; row<grid[col].length;row++)
        {
            let total_neighbours=0;
            for(let i=-1;i<2;i++)
            {
                for(let j=-1;j<2;j++)
                {
                    if(i===0&&j===0)
                    {
                        continue;
                    }
                    else if(col+i>=0&&row+j>=0&&col+i<cols&&row+j<rows)
                    {
                        total_neighbours=total_neighbours+grid[col+i][row+j];
                    }
                }
            }

            //rules of life
            if(grid[col][row]===1&&total_neighbours<2)
            {
                next_gen[col][row]=0;
            }
            else if(grid[col][row]===1&&total_neighbours>3)
            {
                next_gen[col][row]=0;
            }
            else if(grid[col][row]===1&&(total_neighbours===2||total_neighbours===3))
            {
                next_gen[col][row]=1;
            }
            else if(grid[col][row]===0&&total_neighbours===3)
            {
                next_gen[col][row]=1;
            }
        }
    }

    return next_gen;
}

function render(grid)
{
    for (let col=0;col<grid.length;col++)
    {
        for(let row=0; row<grid[col].length;row++)
        {
            const cell=grid[col][row];
            ctx.beginPath();
            ctx.rect(col*resolution,row*resolution,resolution,resolution);
            if(cell===0)
            {
                ctx.fillStyle='white';
                //console.log('white');
            }
            else
            {
                ctx.fillStyle='black';
                //console.log('black');
            }
            ctx.fill();
            //ctx.stroke();
        }
    }
}

function randomise(grid)
{
    for(let col=0;col<grid.length;col++)
    {
        for(let row=0;row<grid[col].length;row++)
        {
            grid[col][row]=Math.floor(Math.random()*2);
        }
    }
    render(grid);
}

function clearGrid(grid)
{
    for(let col=0;col<cols;col++)
    {
        for(let row=0;row<rows;row++)
        {
            grid[col][row]=0;
        }
    }
    render(grid);
    stop();
}

function start()
{
    if(!play)
    {
        play=true;
        //requestAnimationFrame(update);
        timer = setInterval(update,parseInt(document.getElementById("slider").value));
    }
    console.log("start");
}

function stop()
{
    play=false;
    console.log("stop");
    if(timer!=undefined)
    {
        clearInterval(timer);
        timer=undefined;
    }
}

let grid=buildGrid();
update();

function update()
{
    render(grid);
    grid=nextGen(grid);
    
    /*if(play===true)
    {
        //requestAnimationFrame(update);
        setInterval(update,250);
    }*/
}

canvas.addEventListener('mousedown', function(event)
{
    coord=canvas.getBoundingClientRect();
    let col=Math.floor((event.x-coord.left)/resolution);
    let row=Math.floor((event.y-coord.top)/resolution);

    if(!play)
    {
        if(grid[col][row]===0)
        {
            grid[col][row]=1;
            render(grid);
        }
        else
        {
            grid[col][row]=0;
            render(grid);
        }
    }
});