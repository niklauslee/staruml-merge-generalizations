/*
 * Copyright (c) 2014-2018 MKLab. All rights reserved.
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

// Toolbar Button
var $button = $("<a id='toolbar-merge-generalizations' href='#' title='Merge Generalizations'></a>")

/**
 * Return generalization views of a given view.
 */
function getGeneralizations (selected) {
  var edges = app.repository.getEdgeViewsOf(selected)
  var results = edges.filter(function (e) {
    return (e instanceof type.UMLGeneralizationView) && (e.head === selected)
  })
  return results
}

/**
 * Merge generalizations
 */
function handleMerge () {
  // Get a selected view
  var views = app.selections.getSelectedViews()
  if (views.length < 1) {
    app.toast.info('Nothing selected.')
    return
  }

  // Get specialization views
  var selected = views[0]
  var generalizations = getGeneralizations(selected)
  if (generalizations.length < 1) {
    app.toast.info('No generalizations to merge.')
    return
  }

  // Compute coordinates for generalizations
  var sorted = generalizations.map(function (e) { return e.tail.top }).sort()
  var topLine = sorted.length > 0 ? sorted[0] : undefined
  var x = Math.round((selected.left + selected.getRight()) / 2)
  var y1 = Math.round(selected.getBottom())
  var y2 = Math.round((topLine + selected.getBottom() + 15) / 2)

  // Make a command and execute
  var builder = app.repository.getOperationBuilder()
  builder.begin('merge generalizations')
  generalizations.forEach(function (view) {
    if (view.lineStyle !== type.EdgeView.LS_RECTILINEAR) {
      builder.fieldAssign(view, 'lineStyle', type.EdgeView.LS_RECTILINEAR)
    }
    var node = view.tail
    var _x = Math.round((node.left + node.getRight() / 2))
    var _y = Math.round(node.top)
    var ps = new type.Points()
    ps.add(new type.Point(_x, _y))
    ps.add(new type.Point(_x, y2))
    ps.add(new type.Point(x, y2))
    ps.add(new type.Point(x, y1))
    builder.fieldAssign(view, 'points', ps.__write())
  })
  builder.end()
  app.repository.doOperation(builder.getOperation())
}

function init () {
  // Toolbar Button
  $('#toolbar .buttons').append($button)
  $button.click(function () {
    app.commands.execute('merge-generalizations:merge')
  })

  app.commands.register('merge-generalizations:merge', handleMerge)
}

exports.init = init
