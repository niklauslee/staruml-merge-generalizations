/*
 * Copyright (c) 2014 MKLab. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, regexp: true */
/*global define, $, _, window, app, type, appshell, document */

define(function (require, exports, module) {
    "use strict";

    var ExtensionUtils   = app.getModule("utils/ExtensionUtils"),
        CommandManager   = app.getModule("command/CommandManager"),
        Commands         = app.getModule("command/Commands"),
        MenuManager      = app.getModule("menu/MenuManager"),
        Graphics         = app.getModule("core/Graphics"),
        Core             = app.getModule("core/Core"),
        Repository       = app.getModule("core/Repository"),
        OperationBuilder = app.getModule("core/OperationBuilder"),
        DiagramManager   = app.getModule("diagrams/DiagramManager"),
        SelectionManager = app.getModule("engine/SelectionManager"),
        Toast            = app.getModule("ui/Toast");
    
    // Command ID
    var CMD_ARRANGE_SPECIALIZATIONS = "tools.arrange-specializations";
    
    // Toolbar Button
    var $button = $("<a id='toolbar-arrange-specializations' href='#' title='Arrange Specializations'></a>");

    
    /**
     * Return specialization views of a given view.
     */
    function getSpecializations(selected) {
        var edges = Repository.getEdgeViewsOf(selected);
        var results = _.filter(edges, function (e) {
            return (e instanceof type.UMLGeneralizationView) && (e.head === selected);
        });
        return results;
    }
        
    /**
     * Arrange specializations
     */
    function arrange() {
        // Get a selected view
        var views  = SelectionManager.getSelectedViews();
        if (views.length < 1) {
            Toast.info("Nothing selected.");
            return;
        }
        
        // Get specialization views
        var selected  = views[0];
        var specializations = getSpecializations(selected);
        if (specializations.length < 1) {
            Toast.info("No specializations to arrange.");
            return;
        }

        // Compute coordinates for specializations
        var topLine = _.min(_.map(specializations, function (e) { return e.tail.top; })),
            x       = Math.round((selected.left + selected.getRight()) / 2),
            y1      = Math.round(selected.getBottom()),
            y2      = Math.round((topLine + selected.getBottom() + 15) / 2);

        // Make a command and execute
        OperationBuilder.begin('arrange specializations');
        specializations.forEach(function (view) {
            if (view.lineStyle !== Core.LS_RECTILINEAR) {
                OperationBuilder.fieldAssign(view, 'lineStyle', Core.LS_RECTILINEAR);
            }
            var node = view.tail,
                _x   = Math.round((node.left + node.getRight() / 2)),
                _y   = Math.round(node.top);
            var ps = new Graphics.Points();
            ps.add(new Graphics.Point(_x, _y));
            ps.add(new Graphics.Point(_x, y2));
            ps.add(new Graphics.Point(x, y2));
            ps.add(new Graphics.Point(x, y1));
            OperationBuilder.fieldAssign(view, 'points', ps.__write());
        });
        OperationBuilder.end();
        Repository.doOperation(OperationBuilder.getOperation());
    }
    
    /**
     * Initialize Extension
     */
    function init() {
        // Load our stylesheet
        ExtensionUtils.loadStyleSheet(module, "styles.less");
        
        // Toolbar Button
        $("#toolbar .buttons").append($button);
        $button.click(function () {
            CommandManager.execute(CMD_ARRANGE_SPECIALIZATIONS);
        });
        
        // Register Commands
        CommandManager.register("Arrange Specializations", CMD_ARRANGE_SPECIALIZATIONS, arrange);

        // Setup Menus (Add in Tools)
        var menu = MenuManager.getMenu(Commands.TOOLS);
        menu.addMenuItem(CMD_ARRANGE_SPECIALIZATIONS, ["Ctrl-Alt-S"]);
        
    }
    
    init();
    
});
