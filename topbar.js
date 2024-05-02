<div class="container tb">
    <h1 >qewrt</h1>
    <div>
        <span style="position: relative">
            <md-filled-button id="usage-anchor1">Set with idref</md-filled-button>
            <md-menu id="usage-menu1" anchor="usage-anchor1">
            <md-menu-item>
                <a slot="headline">Apple</a>
            </md-menu-item>
            <md-menu-item>
                <div slot="headline">Banana</div>
            </md-menu-item>
            <md-menu-item>
                <div slot="headline">Cucumber</div>
            </md-menu-item>
            </md-menu>
        </span>
        
        <script type="module">
            // This example uses anchor as an ID reference
            {/* const anchorEl = document.body.querySelector('#usage-anchor');
            const menuEl = document.body.querySelector('#usage-menu');
        
            anchorEl.addEventListener('click', () => { menuEl.open = !menuEl.open; }); */}
        </script>
    </div>
</div>