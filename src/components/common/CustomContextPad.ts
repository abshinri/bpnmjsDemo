import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import type { Injector } from "didi";
import type EventBus from "diagram-js/lib/core/EventBus";
import type ContextPad from "diagram-js/lib/features/context-pad/ContextPad";
import type Modeling from "bpmn-js/lib/features/modeling/Modeling";
import type ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import type Connect from "diagram-js/lib/features/connect/Connect";
import type Create from "diagram-js/lib/features/create/Create";
import type PopupMenu from "diagram-js/lib/features/popup-menu/PopupMenu";
import type Canvas from "diagram-js/lib/core/Canvas";
import type Rules from "diagram-js/lib/features/rules/Rules";
import type { Translate } from "diagram-js/lib/i18n/translate";
import type { Base, Shape } from "diagram-js/lib/model";

class EnhancementContextPadProvider extends ContextPadProvider {
  constructor(
    config: any,
    injector: Injector,
    eventBus: EventBus,
    contextPad: ContextPad,
    modeling: Modeling,
    elementFactory: ElementFactory,
    connect: Connect,
    create: Create,
    popupMenu: PopupMenu,
    canvas: Canvas,
    rules: Rules,
    translate: Translate
  ) {
    super(
      config,
      injector,
      eventBus,
      contextPad,
      modeling,
      elementFactory,
      connect,
      create,
      popupMenu,
      canvas,
      rules,
      translate,
      2000
    );

    this._contextPad = contextPad;
    this._modeling = modeling;
    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;
    this._translate = translate;

    this._autoPlace = injector.get("autoPlace", false);
  }

  getContextPadEntries(element: Base) {
    const actions: Record<string, any> = {};

    const appendUserTask = (event: Event, element: Shape) => {
      const shape = this._elementFactory.createShape({ type: "bpmn:UserTask" });
      this._create.start(event, shape, {
        source: element,
      });
    };

    const append = this._autoPlace
      ? (event: Event, element: Shape) => {
          const shape = this._elementFactory.createShape({
            type: "bpmn:UserTask",
          });
          this._autoPlace.append(element, shape);
        }
      : appendUserTask;

    // 添加创建用户任务按钮
    actions["append.append-user-task"] = {
      group: "model",
      className: "bpmn-icon-user-task",
      title: "用户任务",
      action: {
        dragstart: appendUserTask,
        click: append,
      },
    };

    return actions;
  }
}

export default EnhancementContextPadProvider;