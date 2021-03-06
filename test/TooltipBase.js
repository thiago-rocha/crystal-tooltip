'use strict';

import dom from 'bower:metal/src/dom/dom';
import TooltipBase from '../src/TooltipBase';

var tooltip;

describe('TooltipBase', function() {
	afterEach(function() {
		if (tooltip) {
			tooltip.dispose();
		}
	});

	it('should show tooltip on mouseover by a selector after a delay', function(done) {
		dom.enterDocument('<div id="tooltipTrigger1">trigger</div>');
		var trigger = dom.toElement('#tooltipTrigger1');

		tooltip = new TooltipBase({
			delay: [0, 0],
			selector: '#tooltipTrigger1',
			visible: false
		}).render();
		assert.ok(!tooltip.visible);
		dom.triggerEvent(trigger, 'mouseover');
		setTimeout(function() {
			assert.ok(tooltip.visible);
			assert.strictEqual(trigger, tooltip.alignElement);
			dom.exitDocument(trigger);
			done();
		}, 25);
	});

	it('should hide tooltip on mouseout by a selector after a delay', function(done) {
		dom.enterDocument('<div id="tooltipTrigger2">trigger</div>');
		var trigger = dom.toElement('#tooltipTrigger2');

		tooltip = new TooltipBase({
			delay: [0, 0],
			selector: '#tooltipTrigger2',
			visible: true,
			alignElement: trigger
		}).render();
		dom.triggerEvent(trigger, 'mouseout');
		setTimeout(function() {
			assert.ok(!tooltip.visible);
			dom.exitDocument(trigger);
			done();
		}, 25);
	});

	it('should toggle tooltip on click by a selector after a delay', function(done) {
		dom.enterDocument('<div id="tooltipTrigger3">trigger</div>');
		var trigger = dom.toElement('#tooltipTrigger3');

		tooltip = new TooltipBase({
			delay: [0, 0],
			triggerEvents: ['click', 'click'],
			selector: '#tooltipTrigger3',
			visible: false
		}).render();
		dom.triggerEvent(trigger, 'click');
		setTimeout(function() {
			assert.ok(tooltip.visible);
			dom.triggerEvent(trigger, 'click');
			setTimeout(function() {
				assert.ok(!tooltip.visible);
				dom.exitDocument(trigger);
				done();
			}, 25);
		}, 25);
	});

	it('should prevent tooltip to hide when mouseenter tooltip area', function(done) {
		dom.enterDocument('<div id="tooltipTrigger4">trigger</div>');
		var trigger = dom.toElement('#tooltipTrigger4');

		tooltip = new TooltipBase({
			delay: [0, 0],
			selector: '#tooltipTrigger4',
			visible: false
		}).render();
		dom.triggerEvent(trigger, 'mouseover');
		setTimeout(function() {
			assert.ok(tooltip.visible);
			dom.triggerEvent(trigger, 'mouseout');
			dom.triggerEvent(tooltip.element, 'mouseenter');
			setTimeout(function() {
				assert.ok(tooltip.visible);
				dom.triggerEvent(tooltip.element, 'mouseleave');
				setTimeout(function() {
					assert.ok(!tooltip.visible);
					dom.exitDocument(trigger);
					done();
				}, 25);
			}, 25);
		}, 25);
	});

	it('should set "aria-describedBy" on the current "alignElement"', function(done) {
		dom.enterDocument('<div id="trigger">trigger</div>');
		var trigger = dom.toElement('#trigger');

		tooltip = new TooltipBase({
			delay: [0, 0],
			triggerEvents: ['click', 'click'],
			selector: '#trigger',
			visible: false
		}).render();
		dom.triggerEvent(trigger, 'click');
		tooltip.once('attrsChanged', function() {
			assert.strictEqual(tooltip.id, trigger.getAttribute('aria-describedBy'));
			dom.triggerEvent(trigger, 'click');
			tooltip.once('attrsChanged', function() {
				assert.ok(!trigger.hasAttribute('aria-describedBy'));
				dom.exitDocument(trigger);
				done();
			});
		});
	});

	it('should add css class according to tooltip position', function(done) {
		dom.enterDocument('<div id="trigger">trigger</div>');
		var trigger = dom.toElement('#trigger');

		tooltip = new TooltipBase({
			position: TooltipBase.Align.Bottom,
			selector: '#trigger'
		}).render();
		dom.triggerEvent(trigger, 'mouseover');

		tooltip.once('attrsSynced', function() {
			assert.ok(dom.hasClass(tooltip.element, 'bottom'));
			dom.exitDocument(trigger);
			done();
		});
	});

	it('should add css class according to tooltip final position even when different from attr', function(done) {
		dom.enterDocument('<div id="trigger" style="width: 20px; height: 20px; position: absolute;">trigger</div>');
		var trigger = dom.toElement('#trigger');

		tooltip = new TooltipBase({
			position: TooltipBase.Align.Top,
			selector: '#trigger'
		}).render();
		tooltip.element.style.width = '100px';
		tooltip.element.style.height = '30px';
		dom.triggerEvent(trigger, 'mouseover');

		tooltip.once('attrsSynced', function() {
			assert.ok(dom.hasClass(tooltip.element, 'right'));
			done();
		});
	});

	it('should remove listeners when dettached', function(done) {
		dom.enterDocument('<div id="tooltipTrigger5">trigger</div>');
		var trigger = dom.toElement('#tooltipTrigger5');

		tooltip = new TooltipBase({
			delay: [0, 0],
			selector: '#tooltipTrigger5',
			visible: false
		}).render();
		tooltip.detach();
		dom.triggerEvent(trigger, 'mouseover');
		setTimeout(function() {
			assert.ok(!tooltip.visible);
			dom.exitDocument(trigger);
			done();
		}, 25);
	});

	it('should stick open if only changes alignElement', function(done) {
		dom.enterDocument('<div class="trigger" id="tooltipTrigger6">trigger</div>');
		dom.enterDocument('<div class="trigger" id="tooltipTrigger7">trigger</div>');
		var trigger = dom.toElement('#tooltipTrigger6');
		var triggerOther = dom.toElement('#tooltipTrigger7');

		tooltip = new TooltipBase({
			delay: [0, 0],
			triggerEvents: ['click', 'click'],
			selector: '.trigger'
		}).render();
		dom.triggerEvent(trigger, 'click');
		setTimeout(function() {
			dom.triggerEvent(trigger, 'click');
			dom.triggerEvent(triggerOther, 'click');
			setTimeout(function() {
				assert.ok(tooltip.visible);
				assert.strictEqual(triggerOther, tooltip.alignElement);
				dom.exitDocument(trigger);
				dom.exitDocument(triggerOther);
				done();
			}, 25);
		}, 25);
	});
});
