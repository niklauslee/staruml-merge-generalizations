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
        Repository       = app.getModule("core/Repository"),
        DiagramManager   = app.getModule("diagrams/DiagramManager"),
        SelectionManager = app.getModule("engine/SelectionManager");
    
    // Command ID
    var CMD_ARRANGE_SPECIALIZATIONS = "tools.arrange-specializations";
    
    // Toolbar Button
    var $button = $("<a id='toolbar-arrange-specializations' href='#' title='Arrange Specializations'></a>");

    
    /**
     * Arrange Specializations
     */
    function arrangeSpecializations() {
        var views  = SelectionManager.getSelectedViews();
        var dgm = DiagramManager.getCurrentDiagram();
        
        var edges = Repository.getEdgeViewsOf(views[0]);
        
        console.log(edges);
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
        CommandManager.register("Arrange Specializations", CMD_ARRANGE_SPECIALIZATIONS, arrangeSpecializations);

        // Setup Menus (Add in Tools)
        var menu = MenuManager.getMenu(Commands.TOOLS);
        menu.addMenuItem(CMD_ARRANGE_SPECIALIZATIONS, ["Ctrl-Alt-G"]);
        
    }
    
    init();
    
});
